export interface Pagination {
  page: number;
  total: number;
  perPage: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface PaginatedArgs {
  page?: number;
  perPage?: number;
}
