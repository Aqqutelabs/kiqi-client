// Conversion API Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  senderEmail?: string;
  __v?: number;
}

export interface Conversion {
  _id: string;
  user_id: User;
  amount: number;
  solana_wallet: string;
  status: "Pending" | "Approved" | "Rejected";
  requested_at: string;
  createdAt: string;
  updatedAt: string;
  admin_id?: string;
  resolved_at?: string;
  __v?: number;
}

export interface ConversionsResponse {
  statusCode: number;
  data: {
    items: Conversion[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  success: boolean;
}

export interface ConversionActionResponse {
  statusCode: number;
  data: Conversion;
  message: string;
  success: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  success: boolean;
}
