import { AuthRoute } from './'

export const enum AuthErrorType {
  'before',
  'after',
  'start'
}

interface AuthError extends Error {
  _isAuth: true;
  type: keyof typeof AuthErrorType;
  to: AuthRoute | string;
  from: AuthRoute | string;
}

export function createAuthError(from: AuthError['from'], to: AuthError['to'], type: AuthError['type'], message: string) {
  const error = new Error(message)

  // @ts-ignore
  error._isAuth = true
  // @ts-ignore
  error.from = from
  // @ts-ignore
  error.to = to
  // @ts-ignore
  error.type = type

  return error as AuthError
}
