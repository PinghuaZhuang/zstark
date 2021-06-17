import EventAbs from './EventAbs'

interface SensorOptions {
  bubbles?: boolean; // 能否冒泡
  cancelable?: boolean; // 事件是否可以取消
  useCapture?: boolean; // 捕获或者冒泡
}

class SensorAbs<T extends EventAbs<object>> {
  public static type: string = 'sensor'

  public containers: Element[]
  public readonly options: SensorOptions

  public constructor(containers: Element | Element[], options: SensorOptions = {
    bubbles: true,
    cancelable: true,
    useCapture: false,
  }) {
    this.options = Object.assign({}, options)

    if (!Array.isArray(containers)) {
      this.containers = [containers]
    } else {
      this.containers = [...containers]
    }
  }

  public get type() {
    return (this.constructor as typeof SensorAbs).type
  }

  public attach() {
    console.error(`<<< Please implement the attach function.`, this.type)
  }
  public detach() {
    console.error(`<<< Please implement the detach function.`, this.type)
  }

  public on(fn: (e: CustomEvent<T['data']>) => void) {
    this.containers.forEach(element => {
      element.addEventListener(this.type, fn as EventListener, this.options.useCapture === true)
    })
    return this
  }

  public off(fn: (e: CustomEvent<T['data']>) => void) {
    this.containers.forEach(element => {
      element.removeEventListener(this.type, fn as EventListener, this.options.useCapture === true)
    })
    return this
  }

  public trigger(element: Element, sensorEvent: T) {
    if (element == null || !element.dispatchEvent) {
      console.error(`>>> trigger function parameter error.`, element, sensorEvent)
      return
    }

    const event = new CustomEvent<typeof sensorEvent.data>(sensorEvent.type, {
      detail: Object.assign({}, sensorEvent.data),
      bubbles: this.options.bubbles === true, // 默认值 false
      cancelable: !(this.options.cancelable === false), // 默认值 true
    })
    element.dispatchEvent(event)
    return this
  }
}

export default SensorAbs
