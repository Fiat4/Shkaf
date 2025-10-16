export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default interface ApiResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}
