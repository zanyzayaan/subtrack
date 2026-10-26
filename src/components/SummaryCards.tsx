type SummaryCardsProps = {
  subscriptionCount: number;
  monthlySpend: number;
};

function SummaryCards({
  subscriptionCount,
  monthlySpend
}: SummaryCardsProps) {
  return (
    <section className="summary-grid">
      <article className="summary-card">
        <span>
          DETECTED
        </span>

        <strong>
          {subscriptionCount}
        </strong>

        <p>
          recurring subscriptions
        </p>
      </article>

      <article className="summary-card">
        <span>
          MONTHLY SPEND
        </span>

        <strong>
          ${monthlySpend.toFixed(2)}
        </strong>

        <p>
          estimated recurring cost
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;