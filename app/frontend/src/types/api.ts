export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginatedMeta;
}
