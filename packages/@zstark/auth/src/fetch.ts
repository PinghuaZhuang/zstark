import { getToken } from './cookies'
import { stringify } from 'qs'
import { getPreEnv } from './utils'

export const { fetch } = window

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

// 退出登录
export function fetchLoginOut(env: string) {
  const formData = new FormData()
  const token = getToken(env)
  if (token == null) {
    console.warn(`>>> 退出登录需要使用token. token获取失败. token: ${token}`)
    return Promise.resolve({ message: '退出登录需要使用token. token获取失败', token })
  }
  formData.set('token', getToken(env).replace(`Bearer `, ''))

  return fetch(`http://${getPreEnv(env)}nadmin-java.uheixia.com/api/auth/ehr_logout`, {
    method: 'post',
    // headers: {
    //   // 'Content-Type': 'application/json',
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //   Authorization: `Bearer ${token}`
    // },
    // body: JSON.stringify(params),
    body: formData,
  }).then(res => res.json())
}

// 获取用户信息
export function fetchUserInfo(env: string, params: { userId: string | number }): Promise<ApiResult<UserInfo>> {
  return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/user/getInfoById?${stringify(params)}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken(env)}`
    },
  }).then(res => res.json())
}

// 获取项目ID
export function fetchEhrProject(env: string, params: { userId: string | number }): Promise<ApiResult<EHRRouterInfo[]>> {
  return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/project/getProjectByUserId?${stringify(params)}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken(env)}`
    },
  }).then(res => res.json())
}
