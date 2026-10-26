import {
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";

import {
  Transaction,
  TransactionFilters
} from "../../types";

type TransactionsState = {
  transactions: Transaction[];
  filters: TransactionFilters;
};

const initialState: TransactionsState = {
  transactions: [],

  filters: {
    search: "",
    frequency: "all",
    priceIncreasedOnly: false
  }
};

const transactionsSlice =
  createSlice({
    name: "transactions",

    initialState,

    reducers: {
      setTransactions: (
        state,
        action: PayloadAction<Transaction[]>
      ) => {
        state.transactions =
          action.payload;
      },

      clearTransactions: (
        state
      ) => {
        state.transactions = [];
      },

      setSearch: (
        state,
        action: PayloadAction<string>
      ) => {
        state.filters.search =
          action.payload;
      },

      setFrequency: (
        state,
        action: PayloadAction<
          TransactionFilters["frequency"]
        >
      ) => {
        state.filters.frequency =
          action.payload;
      },

      setPriceIncreasedOnly: (
        state,
        action: PayloadAction<boolean>
      ) => {
        state.filters.priceIncreasedOnly =
          action.payload;
      }
    }
  });

export const {
  setTransactions,
  clearTransactions,
  setSearch,
  setFrequency,
  setPriceIncreasedOnly
} = transactionsSlice.actions;

export default
  transactionsSlice.reducer;