import request from '@/utils/request'

const property = 'test'

const invoke = function(names, args) {
  // 最终调用
  const params = {}
  names.forEach((o, i) => {
    params[o] = args[i][0]
  })
  return request(params)
}

const invokeMethods = `post get`.split(' ')

const bridge = function() {
  const args = []
  const names = []

  return function(name, arg) {
    if (name) {
      names.push(name)
    }
    if (arg) {
      if (invokeMethods.includes(names[names.length - 1])) {
        names.pop()
        return invoke(names, args)
      }
      args.push(arg)
    }
  }
}

const handler = {
  apply(target, ctx, args) {
    const result = target(undefined, args)
    console.log('result', result)
    return result || ctx
  },
  get(target, name, receiver) {
    target(name)
    return receiver
  },
}

Object.defineProperty(window, property, {
  enumerable: false,
  get() {
    return new Proxy(bridge(), handler)
  },
})
