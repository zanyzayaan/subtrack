import {
  createSelector
} from "@reduxjs/toolkit";

import {
  RootState
} from "../../app/store";

import {
  detectSubscriptions
} from "../../domain/detection";

const selectTransactions = (
  state: RootState
) =>
  state.transactions.transactions;

const selectFilters = (
  state: RootState
) =>
  state.transactions.filters;

export const selectSubscriptions =
  createSelector(
    [selectTransactions],
    (transactions) =>
      detectSubscriptions(
        transactions
      )
  );

export const selectFilteredSubscriptions =
  createSelector(
    [
      selectSubscriptions,
      selectFilters
    ],
    (
      subscriptions,
      filters
    ) => {
      return subscriptions.filter(
        (subscription) => {
          const matchesSearch =
            subscription.merchant
              .toLowerCase()
              .includes(
                filters.search
                  .toLowerCase()
              );

          const matchesFrequency =
            filters.frequency ===
              "all" ||
            subscription.frequency ===
              filters.frequency;

          const matchesPrice =
            !filters.priceIncreasedOnly ||
            subscription.priceIncreased;

          return (
            matchesSearch &&
            matchesFrequency &&
            matchesPrice
          );
        }
      );
    }
  );

export const selectTotalMonthlySpend =
  createSelector(
    [selectSubscriptions],
    (subscriptions) =>
      subscriptions.reduce(
        (total, subscription) => {
          if (
            subscription.frequency ===
            "monthly"
          ) {
            return (
              total +
              subscription.latestAmount
            );
          }

          return (
            total +
            subscription.latestAmount /
              12
          );
        },
        0
      )
  );