import EventAbs from './EventAbs';
interface SensorOptions {
    bubbles?: boolean;
    cancelable?: boolean;
    useCapture?: boolean;
}
declare class SensorAbs<T extends EventAbs<object>> {
    static type: string;
    containers: Element[];
    readonly options: SensorOptions;
    constructor(containers: Element | Element[], options?: SensorOptions);
    get type(): string;
    attach(): void;
    detach(): void;
    on(fn: (e: CustomEvent<T['data']>) => void): this;
    off(fn: (e: CustomEvent<T['data']>) => void): this;
    trigger(element: Element, sensorEvent: T): this | undefined;
}
export default SensorAbs;
