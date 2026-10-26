import {
  describe,
  expect,
  it
} from "@jest/globals";

import reducer, {
  setTransactions,
  setSearch,
  setFrequency,
  setPriceIncreasedOnly
} from "./transactionsSlice";

describe(
  "transactionsSlice",
  () => {
    it(
      "stores transactions",
      () => {
        const state =
          reducer(
            undefined,
            setTransactions([
              {
                id: "1",
                date: "2026-01-01",
                merchant: "Netflix",
                amount: 15.99
              }
            ])
          );

        expect(
          state.transactions
        ).toHaveLength(1);
      }
    );

    it(
      "updates search filter",
      () => {
        const state =
          reducer(
            undefined,
            setSearch("Netflix")
          );

        expect(
          state.filters.search
        ).toBe("Netflix");
      }
    );

    it(
      "updates frequency filter",
      () => {
        const state =
          reducer(
            undefined,
            setFrequency("monthly")
          );

        expect(
          state.filters.frequency
        ).toBe("monthly");
      }
    );

    it(
      "updates price increase filter",
      () => {
        const state =
          reducer(
            undefined,
            setPriceIncreasedOnly(
              true
            )
          );

        expect(
          state.filters
            .priceIncreasedOnly
        ).toBe(true);
      }
    );
  }
);