// type declaration for recent activity
export type RecentActivity = {
  activity: string;
  time: string;
  amount: string;
  currency: string;
  type: "Added" | "Deducted" | "Referral";
};
