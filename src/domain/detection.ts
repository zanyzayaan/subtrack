import {
  DetectionRule,
  Subscription,
  Transaction
} from "../types";
import { normalizeMerchant } from "./normalization";

const DEFAULT_RULE: DetectionRule = {
  minOccurrences: 2,
  monthlyMinDays: 25,
  monthlyMaxDays: 35,
  annualMinDays: 330,
  annualMaxDays: 395,
  amountTolerance: 0.05
};

function differenceInDays(
  firstDate: string,
  secondDate: string
): number {
  const first = new Date(firstDate).getTime();
  const second = new Date(secondDate).getTime();

  return Math.round(
    Math.abs(second - first) /
      (1000 * 60 * 60 * 24)
  );
}

function addDays(
  dateString: string,
  days: number
): string {
  const date = new Date(dateString);

  date.setDate(
    date.getDate() + days
  );

  return date.toISOString().split("T")[0];
}

function amountsAreSimilar(
  first: number,
  second: number,
  tolerance: number
): boolean {
  if (first === 0 || second === 0) {
    return first === second;
  }

  const difference =
    Math.abs(first - second) /
    Math.max(Math.abs(first), Math.abs(second));

  return difference <= tolerance;
}

function determineFrequency(
  intervals: number[],
  rule: DetectionRule
): Subscription["frequency"] | null {
  if (intervals.length === 0) {
    return null;
  }

  const average =
    intervals.reduce(
      (sum, interval) => sum + interval,
      0
    ) / intervals.length;

  const isMonthly =
    average >= rule.monthlyMinDays &&
    average <= rule.monthlyMaxDays;

  if (isMonthly) {
    return "monthly";
  }

  const isAnnual =
    average >= rule.annualMinDays &&
    average <= rule.annualMaxDays;

  if (isAnnual) {
    return "annual";
  }

  return null;
}

function calculateConfidence(
  occurrences: number,
  intervals: number[]
): Subscription["confidence"] {
  if (occurrences >= 3 && intervals.length >= 2) {
    return "high";
  }

  return "medium";
}

export function detectSubscriptions(
  transactions: Transaction[],
  rule: DetectionRule = DEFAULT_RULE
): Subscription[] {
  const grouped = new Map<
    string,
    Transaction[]
  >();

  for (const transaction of transactions) {
    const normalizedMerchant =
      normalizeMerchant(
        transaction.merchant
      );

    const existing =
      grouped.get(normalizedMerchant) ?? [];

    existing.push(transaction);

    grouped.set(
      normalizedMerchant,
      existing
    );
  }

  const subscriptions: Subscription[] = [];

  for (const [
    normalizedMerchant,
    merchantTransactions
  ] of grouped.entries()) {
    if (
      merchantTransactions.length <
      rule.minOccurrences
    ) {
      continue;
    }

    const sortedTransactions =
      [...merchantTransactions].sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

    const intervals: number[] = [];

    for (
      let index = 1;
      index < sortedTransactions.length;
      index++
    ) {
      intervals.push(
        differenceInDays(
          sortedTransactions[index - 1].date,
          sortedTransactions[index].date
        )
      );
    }

    const frequency =
      determineFrequency(
        intervals,
        rule
      );

    if (!frequency) {
      continue;
    }

    const amounts =
      sortedTransactions.map(
        (transaction) =>
          Math.abs(transaction.amount)
      );

    const latestAmount =
      amounts[amounts.length - 1];

    const previousAmount =
      amounts.length >= 2
        ? amounts[amounts.length - 2]
        : undefined;

    const priceIncreased =
      previousAmount !== undefined &&
      latestAmount > previousAmount &&
      !amountsAreSimilar(
        latestAmount,
        previousAmount,
        rule.amountTolerance
      );

    const averageAmount =
      amounts.reduce(
        (sum, amount) => sum + amount,
        0
      ) / amounts.length;

    const averageInterval =
      intervals.reduce(
        (sum, interval) =>
          sum + interval,
        0
      ) / intervals.length;

    const lastCharge =
      sortedTransactions[
        sortedTransactions.length - 1
      ];

    subscriptions.push({
      id: `${normalizedMerchant}-${frequency}`,
      merchant: lastCharge.merchant,
      frequency,
      latestAmount,
      averageAmount,
      previousAmount,
      priceIncreased,
      occurrences:
        sortedTransactions.length,
      lastChargeDate: lastCharge.date,
      nextExpectedDate: addDays(
        lastCharge.date,
        Math.round(averageInterval)
      ),
      confidence:
        calculateConfidence(
          sortedTransactions.length,
          intervals
        )
    });
  }

  return subscriptions.sort(
    (a, b) =>
      b.latestAmount -
      a.latestAmount
  );
}