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
