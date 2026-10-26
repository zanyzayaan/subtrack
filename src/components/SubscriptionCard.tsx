import { Subscription } from "../types";

type SubscriptionCardProps = {
  subscription: Subscription;
};

function SubscriptionCard({
  subscription
}: SubscriptionCardProps) {
  return (
    <article className="subscription-card">
      <div className="subscription-card-top">
        <div>
          <h2>
            {subscription.merchant}
          </h2>

          <p className="frequency">
            {subscription.frequency}
          </p>
        </div>

        {subscription.priceIncreased && (
          <span className="badge badge-warning">
            Price increased
          </span>
        )}
      </div>

      <div className="subscription-amount">
        <strong>
          $
          {subscription.latestAmount.toFixed(
            2
          )}
        </strong>

        <span>
          /{" "}
          {subscription.frequency ===
          "monthly"
            ? "month"
            : "year"}
        </span>
      </div>

      <div className="subscription-meta">
        <div>
          <span>
            Last charge
          </span>

          <strong>
            {
              subscription.lastChargeDate
            }
          </strong>
        </div>

        <div>
          <span>
            Next expected
          </span>

          <strong>
            {
              subscription.nextExpectedDate
            }
          </strong>
        </div>

        <div>
          <span>
            Confidence
          </span>

          <strong>
            {
              subscription.confidence
            }
          </strong>
        </div>
      </div>

      {subscription.priceIncreased &&
        subscription.previousAmount !==
          undefined && (
          <div className="price-change">
            Previously $
            {subscription.previousAmount.toFixed(
              2
            )}
          </div>
        )}
    </article>
  );
}

export default SubscriptionCard;