declare const NAUTH_USERID = "nauth-userid";
declare const NAUTH_TOKEN = "nauth-token";
export interface UserInfo {
    token?: string;
    userid?: string;
    username?: string;
}
interface AuthQuery {
    [NAUTH_TOKEN]?: string;
    [NAUTH_USERID]?: string;
}
export declare function getToken(env?: string, params?: AuthQuery): string;
export declare function setToken(token: string, env?: string): void;
export declare function getUserId(env?: string, params?: AuthQuery): string;
export declare function setUserId(userid: string, env?: string): void;
export declare function getUserName(env?: string, params?: AuthQuery): string;
export declare function setUserName(username: string, env?: string): void;
export declare function removeAll(env?: string): void;
export {};
