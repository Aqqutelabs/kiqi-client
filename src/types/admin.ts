// Admin Dashboard Types

export interface AdminOverviewData {
  users: number;
  campaigns: number;
  pressReleases: number;
  orders: number;
  successfulOrders: number;
  campaignsByStatus: Array<{
    _id: string;
    count: number;
  }>;
  ordersByPaymentStatus: Array<{
    _id: string | null;
    count: number;
  }>;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface PressReleaseMetrics {
  total_views: number;
  views?: number;
  total_clicks: number;
  engagement_rate: string;
  avg_time_on_page: string;
}

export interface PressReleaseDistribution {
  channels?: string[];
  [key: string]: any;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PressRelease {
  _id: string;
  status: "Draft" | "Scheduled" | "Published";
  distribution: PressReleaseDistribution | string;
  performance_views: string;
  title: string;
  campaign: string;
  user?: User;
  user_id?: User | string;
  date_created: string;
  metrics: PressReleaseMetrics;
  content: string;
  image: string;
  distribution_report: any[];
  campaign_id?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PressReleasesResponse {
  pressReleases: PressRelease[];
  pagination: PaginationData;
}

export interface OrderItem {
  publisherId: string;
  name: string;
  price: string | number;
  quantity?: number;
  selected: boolean;
  _id: string;
}

export interface OrderSummary {
  subtotal: string | number;
  VAT?: string | number;
  vat_percentage?: string;
  vat_amount?: string | number;
  total?: string | number;
  total_amount?: string | number;
  payment_status?: string;
  notes?: string;
}

export interface Payment {
  _id: string;
  user?: User;
  user_id?: User | string;
  items?: OrderItem[];
  order_summary?: OrderSummary;
  reference?: string;
  status?: "Pending" | "Completed";
  payment_status?: "Pending" | "Successful";
  payment_method?: string;
  notes?: string;
  publications?: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: PaginationData;
}

export interface AdminOverviewResponse {
  statusCode: number;
  data: AdminOverviewData;
  message: string;
  success: boolean;
}

export interface PressReleasesApiResponse {
  statusCode: number;
  data: PressRelease[];
  pagination: PaginationData;
  message: string;
  success: boolean;
}

export interface PaymentsApiResponse {
  statusCode: number;
  data: Payment[];
  pagination: PaginationData;
  message: string;
  success: boolean;
}

export interface ChangePressReleaseStatusResponse {
  statusCode: number;
  data: {
    message: string;
    pressRelease: PressRelease;
  };
  message: string;
  success: boolean;
}

export interface Campaign {
  _id: string;
  campaignName: string;
  subjectLine: string;
  status: "Draft" | "Scheduled" | "Sent";
  user: User;
  audienceSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  pagination: PaginationData;
}

export interface CampaignsApiResponse {
  statusCode: number;
  data: CampaignsResponse;
  message: string;
  success: boolean;
}

export interface DeleteCampaignResponse {
  statusCode: number;
  data: {
    message: string;
  };
  message: string;
  success: boolean;
}

export interface PublisherMetrics {
  domain_authority: number;
  trust_score: number;
  avg_traffic: number;
  social_signals: number;
}

export interface PublisherAddOn {
  enabled: boolean;
  price?: number;
  description?: string;
}

export interface PublisherAddOns {
  backdating: PublisherAddOn;
  socialPosting: PublisherAddOn;
  featuredPlacement: PublisherAddOn;
  newsletterInclusion: PublisherAddOn;
  authorByline: PublisherAddOn;
  paidAmplification: PublisherAddOn;
  whitePaperGating: PublisherAddOn & { leadGenEnabled?: boolean };
}

export interface PublisherFAQ {
  _id?: string;
  question: string;
  answer: string;
  isActive?: boolean;
  order?: number;
}

export interface Publisher {
  _id: string;
  publisherId: string;
  name: string;
  price: string | number;
  avg_publish_time: string;
  industry_focus: string[];
  region_reach: string[];
  audience_reach: string;
  key_features: string[];
  metrics: PublisherMetrics;
  formatDepth?: string[];
  addOns?: PublisherAddOns;
  enhancedMetrics?: {
    lastUpdated: string;
  };
  averageRating?: number;
  totalReviews?: number;
  faqs?: PublisherFAQ[];
  isPublished?: boolean;
  isMarketplaceListing?: boolean;
  viewCount?: number;
  cartAddCount?: number;
  bookmarkCount?: number;
  shareCount?: number;
  conversionRate?: number;
  createdBy?: string | User;
  updatedBy?: User;
  reviews?: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PublisherFormData {
  name: string;
  price: number | string;
  avg_publish_time: string;
  audience_reach: string;
  industry_focus: string[];
  region_reach: string[];
  isMarketplaceListing?: boolean;
  key_features?: string[];
}

export interface PublishersResponse {
  publishers: Publisher[];
  pagination: PaginationData;
}

export interface PublishersApiResponse {
  statusCode: number;
  data: PublishersResponse;
  message: string;
  success: boolean;
}

export interface CreatePublisherResponse {
  statusCode: number;
  data: Publisher;
  message: string;
  success: boolean;
}

export interface UpdatePublisherResponse {
  statusCode: number;
  data: Publisher;
  message: string;
  success: boolean;
}

export interface DeletePublisherResponse {
  statusCode: number;
  data: {
    message: string;
  };
  message: string;
  success: boolean;
}

export interface UpdatePublisherAddOnsResponse {
  statusCode: number;
  data: Publisher;
  message: string;
  success: boolean;
}

export interface UpdatePublisherFAQsResponse {
  statusCode: number;
  data: Publisher;
  message: string;
  success: boolean;
}

