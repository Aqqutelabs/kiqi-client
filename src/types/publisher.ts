type Review = {
  name: string;
  rating: number;
  comment: string;
};

type Metrics = {
  domain_authority: number;
  trust_score: number;
  avg_traffic: number;
  social_signals: number;
};

type AddOnValue = {
  enabled: boolean;
  leadGenEnabled?: boolean;
};

type Publisher = {
  id: string;
  name: string;
  price: string;
  avg_publish_time: string;
  industry_focus: string[];
  region_reach: string[];
  audience_reach: string;
  metrics: Metrics;
  addOns: Record<string, AddOnValue>;
  reviews: Review[];
};
