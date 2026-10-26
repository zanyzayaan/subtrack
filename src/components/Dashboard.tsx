import { useDispatch, useSelector } from "react-redux";

import {
  AppDispatch,
  RootState
} from "../app/store";

import {
  clearTransactions,
  setFrequency,
  setPriceIncreasedOnly,
  setSearch
} from "../features/transactions/transactionsSlice";

import {
  selectFilteredSubscriptions,
  selectTotalMonthlySpend
} from "../features/transactions/transactionsSelectors";

import SummaryCards from "./SummaryCards";
import SubscriptionList from "./SubscriptionList";

function Dashboard() {
  const dispatch =
    useDispatch<AppDispatch>();

  const subscriptions =
    useSelector(
      selectFilteredSubscriptions
    );

  const totalMonthlySpend =
    useSelector(
      selectTotalMonthlySpend
    );

  const filters =
    useSelector(
      (state: RootState) =>
        state.transactions.filters
    );

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <div className="brand">
            <span className="brand-mark">
              S
            </span>

            <span>SubTrack</span>
          </div>

          <h1>
            Your subscriptions
          </h1>

          <p>
            Recurring charges detected
            from your transaction history.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            dispatch(
              clearTransactions()
            )
          }
        >
          Upload another CSV
        </button>
      </header>

      <SummaryCards
        subscriptionCount={
          subscriptions.length
        }
        monthlySpend={
          totalMonthlySpend
        }
      />

      <section className="filters">
        <input
          type="search"
          placeholder="Search merchants..."
          value={filters.search}
          onChange={(event) =>
            dispatch(
              setSearch(
                event.target.value
              )
            )
          }
        />

        <select
          value={filters.frequency}
          onChange={(event) =>
            dispatch(
              setFrequency(
                event.target
                  .value as
                  | "all"
                  | "monthly"
                  | "annual"
              )
            )
          }
        >
          <option value="all">
            All frequencies
          </option>

          <option value="monthly">
            Monthly
          </option>

          <option value="annual">
            Annual
          </option>
        </select>

        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={
              filters.priceIncreasedOnly
            }
            onChange={(event) =>
              dispatch(
                setPriceIncreasedOnly(
                  event.target.checked
                )
              )
            }
          />

          Price increased
        </label>
      </section>

      <SubscriptionList
        subscriptions={
          subscriptions
        }
      />
    </main>
  );
}

export default Dashboard;