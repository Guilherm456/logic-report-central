export interface PaginationResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Pagination {
  page?: number;
  size?: number;
}
