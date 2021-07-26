/* eslint-disable @typescript-eslint/no-explicit-any */
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

export default function(target: any, property: string, invoke: (params: object) => any, end?: string | string[]) {
  const invokeMethods = Array.isArray(end) ? end : [end || 'end']

  function _invoke(names: string[], args: any[][]) {
    // 最终调用
    const params = {}
    names.forEach((o, i) => {
      params[o] = args[i][0]
    })
    return invoke(params)
  }

  function bridge() {
    const args: any[] = []
    const names: string[] = []

    return function(name?: string, arg?: any[]) {
      if (name) {
        names.push(name)
      }
      if (arg) {
        if (invokeMethods.includes(names[names.length - 1])) {
          names.pop()
          return _invoke(names, args)
        }
        args.push(arg)
      }
    }
  }

  Object.defineProperty(target, property, {
    enumerable: false,
    get() {
      return new Proxy(bridge(), {
        apply(target: ReturnType<typeof bridge>, ctx, args) {
          const result = target(undefined, args)
          return result || ctx
        },
        get(target, name, receiver) {
          target(name as string)
          return receiver
        },
      })
    },
  })
}
