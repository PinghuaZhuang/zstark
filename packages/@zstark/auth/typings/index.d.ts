import { AuthEventBefore, AuthEventAfter } from './hook';
export interface AuthRoute {
    fullPath: string;
    path: string;
    params: object;
    query: object;
    regex: RegExp;
}
interface AuthHandleOption {
    path?: string;
    env?: string;
    after?: (e: AuthEventAfter) => void;
    before?: (e: AuthEventBefore) => void;
    onLogin?: (next: () => void, options?: AuthHandleOption & {
        token?: string;
    }) => void;
    onLoginOut?: (next: () => void, options?: AuthHandleOption & {
        token?: string;
    }) => void;
}
declare const _default: {
    version: string;
    readonly token: string;
    readonly env: string | undefined;
    readonly started: boolean;
    readonly projectId: number | null | undefined;
    support: {
        readonly pushState: boolean;
    };
    getUserInfo(): {
        token: string;
        userid: string;
        username: string;
    };
    getUserInfoAll(): Promise<import("./fetch").ApiResult<import("./fetch").UserInfo>>;
    getProjectId: (name: string, params?: object | undefined) => Promise<number | null>;
    login: (params?: string | boolean | object | undefined, state?: string | object | undefined) => void;
    loginOut: (params?: string | object | undefined, state?: string | undefined) => void;
    start: (options?: AuthHandleOption | undefined) => void;
};
export declare const start: (options?: AuthHandleOption | undefined) => void;
export declare const login: (params?: string | boolean | object | undefined, state?: string | object | undefined) => void;
export declare const loginOut: (params?: string | object | undefined, state?: string | undefined) => void;
export default _default;
