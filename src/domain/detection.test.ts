import { describe, expect, it } from "@jest/globals";
import { detectSubscriptions } from "./detection";
import { Transaction } from "../types";

describe("detectSubscriptions", () => {
  it("detects a monthly subscription", () => {
    const transactions: Transaction[] = [
      {
        id: "1",
        date: "2026-01-05",
        merchant: "Netflix",
        amount: -15.99
      },
      {
        id: "2",
        date: "2026-02-05",
        merchant: "Netflix",
        amount: -15.99
      }
    ];

    const result =
      detectSubscriptions(
        transactions
      );

    expect(result).toHaveLength(1);

    expect(
      result[0].merchant
    ).toBe("Netflix");

    expect(
      result[0].frequency
    ).toBe("monthly");

    expect(
      result[0].latestAmount
    ).toBe(15.99);
  });
});
it("accepts irregular monthly intervals", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2026-01-01",
      merchant: "Spotify",
      amount: -10.99
    },
    {
      id: "2",
      date: "2026-01-29",
      merchant: "Spotify",
      amount: -10.99
    },
    {
      id: "3",
      date: "2026-03-01",
      merchant: "Spotify",
      amount: -10.99
    }
  ];

  const result =
    detectSubscriptions(
      transactions
    );

  expect(result).toHaveLength(1);

  expect(
    result[0].frequency
  ).toBe("monthly");
});

it("groups merchant name variants together", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2026-01-05",
      merchant: "NETFLIX.COM",
      amount: -15.99
    },
    {
      id: "2",
      date: "2026-02-05",
      merchant: "Netflix Inc.",
      amount: -15.99
    }
  ];

  const result =
    detectSubscriptions(
      transactions
    );

  expect(result).toHaveLength(1);
});
it("detects a price increase", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2026-01-05",
      merchant: "Netflix",
      amount: -15.99
    },
    {
      id: "2",
      date: "2026-02-05",
      merchant: "Netflix",
      amount: -17.99
    }
  ];

  const result =
    detectSubscriptions(
      transactions
    );

  expect(result).toHaveLength(1);

  expect(
    result[0].priceIncreased
  ).toBe(true);

  expect(
    result[0].previousAmount
  ).toBe(15.99);

  expect(
    result[0].latestAmount
  ).toBe(17.99);
});

it("detects annual subscriptions", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-01-15",
      merchant: "Amazon Prime",
      amount: -139
    },
    {
      id: "2",
      date: "2026-01-15",
      merchant: "Amazon Prime",
      amount: -139
    }
  ];

  const result =
    detectSubscriptions(
      transactions
    );

  expect(result).toHaveLength(1);

  expect(
    result[0].frequency
  ).toBe("annual");
});

it("ignores merchants without recurring intervals", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2026-01-01",
      merchant: "Apple Store",
      amount: -500
    },
    {
      id: "2",
      date: "2026-01-20",
      merchant: "Apple Store",
      amount: -100
    }
  ];

  const result =
    detectSubscriptions(
      transactions
    );

  expect(result).toHaveLength(0);
});