import { Subscription } from "../types";
import SubscriptionCard from "./SubscriptionCard";

type SubscriptionListProps = {
  subscriptions: Subscription[];
};

function SubscriptionList({
  subscriptions
}: SubscriptionListProps) {
  if (
    subscriptions.length === 0
  ) {
    return (
      <section className="empty-state">
        <h2>
          No subscriptions found
        </h2>

        <p>
          Try changing your filters
          or uploading a different
          transaction history.
        </p>
      </section>
    );
  }

  return (
    <section className="subscription-grid">
      {subscriptions.map(
        (subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={
              subscription
            }
          />
        )
      )}
    </section>
  );
}

export default SubscriptionList;