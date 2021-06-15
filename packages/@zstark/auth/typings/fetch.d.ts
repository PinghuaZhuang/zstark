export declare const fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
export interface ApiResult<T> {
    code: number;
    data: T;
    message: string;
}
export interface UserInfo {
    avatar: string;
    createdAt: string;
    ddUnionid: string;
    ddUserId: string;
    departmentId: string;
    email?: string;
    id: 1261;
    jobnumber?: string;
    mfUserId?: string;
    mobile: string;
    name: string;
    orgEmail?: string;
    password: string;
    position?: string;
    roleId: number;
    status: number;
    tel?: string;
    updatedAt: string;
}
export interface EHRRouterInfo {
    wnlProjectId: number | null;
    name: string;
    domain: string;
}
export declare function fetchLoginOut(env: string): Promise<any>;
export declare function fetchUserInfo(env: string, params: {
    userId: string | number;
}): Promise<ApiResult<UserInfo>>;
export declare function fetchEhrProject(env: string, params: {
    userId: string | number;
}): Promise<ApiResult<EHRRouterInfo[]>>;
