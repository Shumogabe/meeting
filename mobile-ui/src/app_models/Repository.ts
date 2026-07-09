export interface IOptionRequest {
    authorization?: boolean;
    api_url?: string;
    api_id?: string;
    api_secret?: string;
    api_auth?: string;   //[api_id]/[api_secret]
    headers?: any;
    params?: any;
    callback?: Function;
    loading?: Function;
    loadingController?: any;
}

export interface IOptionResponse {
    // StatusCode?: number,
    // Succeeded?: boolean,
    // Message?: string,
    // Data?: any,
    // HasNextPage?: boolean,
    // HasPreviousPage?: boolean,
    // MaxPage?: number,
    // PageNumber?: number,
    // PageSize?: number,
    // TotalPages?: number,
    // TotalRecords?: number,

    data?: any;
    status?: boolean;
    message?: string;

    pageNumber?: number;
    pageSize?: number;
    totalRecords?: number;

}

export interface IConfigs {
    madonvi?: string;
    tendv?: string;
}