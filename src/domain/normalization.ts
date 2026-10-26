const LEGAL_SUFFIXES = [
  "incorporated",
  "inc",
  "llc",
  "ltd",
  "limited",
  "corp",
  "corporation",
  "co",
  "company"
];

export function normalizeMerchant(merchant: string): string {
  let normalized = merchant
    .toLowerCase()
    .trim();

  normalized = normalized.replace(
    /^https?:\/\/(www\.)?/,
    ""
  );

  normalized = normalized.replace(
    /^www\./,
    ""
  );

  normalized = normalized.replace(
    /\.(com|net|org|co|io)\b/g,
    ""
  );

  normalized = normalized.replace(
    /[^a-z0-9\s]/g,
    " "
  );

  normalized = normalized
    .split(/\s+/)
    .filter(Boolean)
    .filter(
      (word) => !LEGAL_SUFFIXES.includes(word)
    )
    .join(" ");

  return normalized;
}