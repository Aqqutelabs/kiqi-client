

export const parseAmount = (value: string): number => {
  const cleaned = value.replace(/[₦,\s]/g, "").toLowerCase(); // remove ₦ and commas

  if (cleaned.endsWith("k")) {
    return parseFloat(cleaned.replace("k", "")) * 1000;
  }
  if (cleaned.endsWith("m")) {
    return parseFloat(cleaned.replace("m", "")) * 1_000_000;
  }

  return parseFloat(cleaned);
};
