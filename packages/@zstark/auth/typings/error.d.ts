import { AuthRoute } from './';
export declare const enum AuthErrorType {
    'before' = 0,
    'after' = 1,
    'start' = 2
}
interface AuthError extends Error {
    _isAuth: true;
    type: keyof typeof AuthErrorType;
    to: AuthRoute | string;
    from: AuthRoute | string;
}
export declare function createAuthError(from: AuthError['from'], to: AuthError['to'], type: AuthError['type'], message: string): AuthError;
export {};
