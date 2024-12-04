import { Pagination } from "../types/response";

export type PaginationParams = {
    page: number;
    size: number;
}

export const inititalValues = {
    page: 1,
    size: 6,
    hasMore: false
} as Pagination