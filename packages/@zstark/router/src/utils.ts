import { RouteOptions } from './Route'

export function createRouteMap(route: RouteOptions) {

}

export function cleanPath(path: string): string {
  return path.replace(/\/\//g, '/')
}

export function normalizePath(path: string, parent?: RouteOptions) {
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}

export function getPathname(base: string) {
  let path = window.location.pathname
  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}
