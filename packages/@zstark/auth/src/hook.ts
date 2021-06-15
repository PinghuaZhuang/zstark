import events from 'events'

import { AuthRoute } from './'
import { UserInfo } from './cookies'

const eventEmitter = new events.EventEmitter()

const HOOK_BEFORE = 'nehook:auth-befroe'
const HOOK_AFTER = 'nehook:auth-after'

interface AuthEvent {
  type: typeof HOOK_BEFORE | typeof HOOK_AFTER;
  data: unknown;
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

export function hook(type: string, handler: (e: AuthEventBefore | AuthEventAfter) => void) {
  eventEmitter.on(type, handler)
}

export function createEventBefore(data: AuthEventBefore['data']): AuthEventBefore {
  return {
    type: HOOK_BEFORE,
    data,
  }
}

export function createEventAfter(data: AuthEventAfter['data']): AuthEventAfter {
  return {
    type: HOOK_AFTER,
    data,
  }
}

export function emit(event: AuthEvent) {
  eventEmitter.emit(event.type, event)
}

export function registerHook({ after, before }: { after?: (e: AuthEventAfter) => void; before?: (e: AuthEventBefore) => void }) {
  hook(HOOK_BEFORE, (e: AuthEventAfter) => {
    return before && before(e)
  })
  hook(HOOK_AFTER, (e: AuthEventBefore) => {
    return after && after(e)
  })
}
