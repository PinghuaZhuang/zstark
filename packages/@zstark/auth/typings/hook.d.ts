import { AuthRoute } from './';
import { UserInfo } from './cookies';
declare const HOOK_BEFORE = "nehook:auth-befroe";
declare const HOOK_AFTER = "nehook:auth-after";
interface AuthEvent {
    type: typeof HOOK_BEFORE | typeof HOOK_AFTER;
    data: any;
}
export interface AuthEventBefore extends AuthEvent {
    data: {
        to: AuthRoute;
        from: AuthRoute;
    };
}
export interface AuthEventAfter extends AuthEvent {
    data: AuthEventBefore['data'] & UserInfo;
}
export declare function hook(type: string, handler: (e: AuthEventBefore | AuthEventAfter) => void): void;
export declare function createEventBefore(data: AuthEventBefore['data']): AuthEventBefore;
export declare function createEventAfter(data: AuthEventAfter['data']): AuthEventAfter;
export declare function emit(event: AuthEvent): void;
export declare function registerHook({ after, before }: {
    after?: (e: AuthEventAfter) => void;
    before?: (e: AuthEventBefore) => void;
}): void;
export {};
