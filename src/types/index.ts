export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  description?: string;
};

export type SubscriptionFrequency =
  | "monthly"
  | "annual";

export type DetectionConfidence =
  | "high"
  | "medium";

export type Subscription = {
  id: string;
  merchant: string;
  frequency: SubscriptionFrequency;
  latestAmount: number;
  averageAmount: number;
  previousAmount?: number;
  priceIncreased: boolean;
  occurrences: number;
  lastChargeDate: string;
  nextExpectedDate: string;
  confidence: DetectionConfidence;
};

export type DetectionRule = {
  minOccurrences: number;
  monthlyMinDays: number;
  monthlyMaxDays: number;
  annualMinDays: number;
  annualMaxDays: number;
  amountTolerance: number;
};

export type TransactionFilters = {
  search: string;
  frequency: SubscriptionFrequency | "all";
  priceIncreasedOnly: boolean;
};