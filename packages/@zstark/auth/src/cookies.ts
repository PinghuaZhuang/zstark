import Cookies from 'js-cookie'

const NAUTH_USERID = `nauth-userid`
// const NAUTH_DDUSERID = `nauth-dduserid`
// const NAUTH_DDUNIONID = `nauth-ddunionid`
const NAUTH_TOKEN = `nauth-token`
const NAUTH_USERNAME = `nauth-username`

const ENV_PRODUCTION = 'production'
const EXPIRES = 15
export interface UserInfo {
  token?: string;
  userid?: string;
  username?: string;
}

interface AuthQuery {
  [NAUTH_TOKEN]?: string;
  [NAUTH_USERID]?: string;
}

function getKeyWithEnv(key: string, env: string = ENV_PRODUCTION) {
  return (env !== ENV_PRODUCTION && env.length) ? key + `-${env}` : key
}

export function setToken(token: string, env: string = ENV_PRODUCTION) {
  Cookies.set(getKeyWithEnv(NAUTH_TOKEN, env), token, { expires: EXPIRES })
}

export function getToken(env: string = ENV_PRODUCTION, params?: AuthQuery) {
  let token = Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env))
  if (!token && params && (token = params[NAUTH_TOKEN.replace(/-/g, '_')])) {
    setToken(token, env)
    return token
  }
  return token as string
}

export function setUserId(userid: string, env: string = ENV_PRODUCTION) {
  Cookies.set(getKeyWithEnv(NAUTH_USERID, env), userid, { expires: EXPIRES })
}

export function getUserId(env: string = ENV_PRODUCTION, params?: AuthQuery) {
  let userId = Cookies.get(getKeyWithEnv(NAUTH_USERID, env))
  if (!userId && params && (userId = params[NAUTH_USERID.replace(/-/g, '_')])) {
    setUserId(userId, env)
    return userId
  }
  return userId as string
}

export function setUserName(username: string, env: string = ENV_PRODUCTION) {
  Cookies.set(getKeyWithEnv(NAUTH_USERNAME, env), username, { expires: EXPIRES })
}

export function getUserName(env: string = ENV_PRODUCTION, params?: AuthQuery) {
  let username = Cookies.get(getKeyWithEnv(NAUTH_USERNAME, env))
  if (!username && params && (username = params[NAUTH_USERNAME.replace(/-/g, '_')])) {
    setUserName(username, env)
    return username
  }
  return username as string
}

export function removeAll(env: string = ENV_PRODUCTION) {
  Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env))
  Cookies.remove(getKeyWithEnv(NAUTH_USERID, env))
  Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env))

  if (/98du.com$/.test(window.location.hostname)) {
    Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env), { domain: '.98du.com' })
    Cookies.remove(getKeyWithEnv(NAUTH_USERID, env), { domain: '.98du.com' })
    Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env), { domain: '.98du.com' })
  }
}
