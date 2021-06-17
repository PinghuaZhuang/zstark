declare class EventAbs<T> {
    /**
     * 事件类型
     */
    static readonly type: string;
    data: T;
    constructor(data: T);
    get type(): string;
}
export default EventAbs;
