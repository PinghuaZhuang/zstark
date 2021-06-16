class EventAbs<T> {
  /**
   * 事件类型
   */
  public static readonly type: string = 'custom-event'
  public data: T

  public constructor(data: T) {
    this.data = { ...data }
  }

  public get type() {
    return (this.constructor as typeof EventAbs).type
  }
}

export default EventAbs
