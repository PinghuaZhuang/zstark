/*!
 * @zstark/eslint-plugin-zstark 0.0.0
 */

class EventAbs {
    constructor(data) {
        this.data = Object.assign({}, data);
    }
    get type() {
        return this.constructor.type;
    }
}
/**
 * 事件类型
 */
EventAbs.type = 'custom-event';

class SensorAbs {
    constructor(containers, options = {
        bubbles: true,
        cancelable: true,
        useCapture: false,
    }) {
        this.options = Object.assign({}, options);
        if (!Array.isArray(containers)) {
            this.containers = [containers];
        }
        else {
            this.containers = [...containers];
        }
    }
    get type() {
        return this.constructor.type;
    }
    attach() {
        console.error(`<<< Please implement the attach function.`, this.type);
    }
    detach() {
        console.error(`<<< Please implement the detach function.`, this.type);
    }
    on(fn) {
        this.containers.forEach(element => {
            element.addEventListener(this.type, fn, this.options.useCapture === true);
        });
        return this;
    }
    off(fn) {
        this.containers.forEach(element => {
            element.removeEventListener(this.type, fn, this.options.useCapture === true);
        });
        return this;
    }
    trigger(element, sensorEvent) {
        if (element == null || !element.dispatchEvent) {
            console.error(`>>> trigger function parameter error.`, element, sensorEvent);
            return;
        }
        const event = new CustomEvent(sensorEvent.type, {
            detail: Object.assign({}, sensorEvent.data),
            bubbles: this.options.bubbles === true,
            cancelable: !(this.options.cancelable === false),
        });
        element.dispatchEvent(event);
        return this;
    }
}
SensorAbs.type = 'sensor';

export { EventAbs, SensorAbs };
