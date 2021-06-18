import Route, { RouteOptions } from './Route'
import { getPathname } from './utils'

const EVENT_TYPE = 'popstate'

type RouteInfo = Pick<RouteOptions, 'name' | 'path'>

class Router {
  private baseUrl: string;
  private routers: Route[] = []
  // private listeners: any[] = []
  private current!: Route
  public destroy!: () => void

  public constructor(options: {
    routes: RouteOptions[];
    baseUrl: string;
  }) {
    const { routes, baseUrl } = options
    this.baseUrl = baseUrl
    this.routers = routes.map(o => new Route(o))
    // this.current = this.routers[0]

    this.init()
  }

  public init() {
    this.setListeners()

    // 初始化当前路由
    this.current = this.match(getPathname(this.baseUrl))
  }

  public setListeners() {
    const handleRoutingEvent = () => {
      const current = this.current
      this.transitionTo(
        getPathname(this.baseUrl),
        (route) => {
          if (route) {
            this.push(route)
          } else {
            current.mount()
          }
        },
        () => { }
      )
    }

    // 刷新页面的时候是否会触发 popstate
    window.addEventListener(
      EVENT_TYPE,
      handleRoutingEvent
    )

    // 添加销毁时间
    this.destroy = () => {
      window.removeEventListener(EVENT_TYPE, handleRoutingEvent)
    }
  }

  private transitionTo(
    pathname: string,
    done: (route?: RouteInfo['path'] | RouteInfo) => void,
    fail: (error: Error) => void
  ) {
    const route = this.match(pathname)
    const prev = this.current

    if (route) {
      try {
        this.updateRoute(route)
        route.emit(route, prev)
        done()
      } catch (error) {
        fail(error)
      }
    } else {
      // create error
      fail(new Error('xxxx'))
    }

    // if (this.current.fullPath === route.fullPath) {
    //   // create error
    //   return
    // }
  }

  private updateRoute(route: Route) {
    this.current = route
    // this.cb && this.cb(route)
  }

  public go(route: Route | string) {
    // 判断 route
    // route.render()
  }

  public push(route: RouteInfo['path'] | RouteInfo) {

  }

  public match(pathname: string): Route {
    // @ts-ignore
    return
  }

  public addRoute(route: Route) {
    this.routers.push(route)
  }

  public xxx() {}
}

export default Router
