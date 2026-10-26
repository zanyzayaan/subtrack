import Papa from "papaparse";
import { Transaction } from "../types";

type RawRow = Record<
  string,
  string | undefined
>;

function normalizeHeader(
  header: string
): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findColumn(
  row: RawRow,
  candidates: string[]
): string | undefined {
  const keys = Object.keys(row);

  for (const candidate of candidates) {
    const normalizedCandidate =
      normalizeHeader(candidate);

    const match = keys.find(
      (key) =>
        normalizeHeader(key) ===
        normalizedCandidate
    );

    if (match) {
      return row[match];
    }
  }

  return undefined;
}

function parseAmount(
  value: string | undefined
): number | null {
  if (!value) {
    return null;
  }

  const cleaned =
    value
      .replace(/[$€£₹,\s]/g, "")
      .replace(/[()]/g, "");

  const parsed =
    Number(cleaned);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.abs(parsed);
}

function parseRow(
  row: RawRow,
  index: number
): Transaction | null {
  const date =
    findColumn(row, [
      "date",
      "transaction date",
      "posted date"
    ]);

  const merchant =
    findColumn(row, [
      "merchant",
      "description",
      "name",
      "payee"
    ]);

  const amount =
    findColumn(row, [
      "amount",
      "transaction amount"
    ]);

  const debit =
    findColumn(row, [
      "debit",
      "withdrawal"
    ]);

  const credit =
    findColumn(row, [
      "credit",
      "deposit"
    ]);

  if (!date || !merchant) {
    return null;
  }

  let numericAmount: number | null = null;

  if (amount) {
    numericAmount =
      parseAmount(amount);
  }

  if (
    numericAmount === null &&
    debit
  ) {
    numericAmount =
      parseAmount(debit);
  }

  if (
    numericAmount === null &&
    credit
  ) {
    numericAmount =
      parseAmount(credit);
  }

  if (
    numericAmount === null
  ) {
    return null;
  }

  return {
    id: `csv-${index}-${date}-${merchant}`,
    date: date.trim(),
    merchant: merchant.trim(),
    amount: numericAmount,
    description: merchant.trim()
  };
}

export function parseTransactions(
  file: File
): Promise<Transaction[]> {
  return new Promise(
    (resolve, reject) => {
      Papa.parse<RawRow>(file, {
        header: true,
        skipEmptyLines: true,

        complete: (results) => {
          const transactions =
            results.data
              .map(parseRow)
              .filter(
                (
                  transaction
                ): transaction is Transaction =>
                  transaction !== null
              );

          if (
            transactions.length === 0
          ) {
            reject(
              new Error(
                "No valid transactions were found in the CSV."
              )
            );

            return;
          }

          resolve(transactions);
        },

        error: (error) => {
          reject(error);
        }
      });
    }
  );
}