/* eslint-disable */
export interface RouteOptions {
  name?: string;
  path: string;
  meta?: object;
  render: () => string | Element;
  container: string | Element;
}

class Route implements Pick<RouteOptions, 'name' | 'path' | 'meta' | 'render'> {
  public container: Element
  public name
  public path
  public meta
  public render

  public constructor(options: RouteOptions) {
    const { container, name, path, meta, render } = options

    this.container = container instanceof Element ? container : document.querySelector(container as string) as Element
    if (this.container == null) {
      // create error
    }

    const renderBind = render.bind(this)
    this.name = name
    this.path = path
    this.meta = meta
    this.render = renderBind
  }

  // on emit beforeEnter(prevRoute) done renderError

  public mount() {
    // promise try catch
    const ret = this.render()
    this.container.innerHTML = ''

    if (ret instanceof Element) {
      this.container.appendChild(ret)
    } else {
      this.container.innerHTML = ret
    }
  }
}

export default Route
