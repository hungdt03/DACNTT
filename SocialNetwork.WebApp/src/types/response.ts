import { UserResource } from "./user"

export type AuthResponse = {
    user: UserResource;
    token: {
        accessToken: string;
        refreshToken: string;
    }
}

export interface BaseResponse {
    message: string;
    statusCode: number;
    isSuccess: boolean;
}

export interface DataResponse<T> extends BaseResponse {
    data: T
}

export type Pagination = {
    page: number;
    size: number;
    hasMore: boolean;
    totalPages?: number;
    totalCount?: number;
    havePrevPage?: boolean;
    haveNextPage?: boolean;
}

export interface PaginationResponse<T> extends BaseResponse {
    data: T,
    pagination: Pagination
}