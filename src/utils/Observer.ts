interface Event {
    type: string,
    target: any
}

class Observer {
    private listeners: any;
    constructor() {
        this.listeners = {};
    }
    public addListener = (type: string, listener: Function) => {
        let listeners = this.listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    }
    public hasListener = (type: string, listener: Function) => {
        let listeners = this.listeners;
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    }
    public removeListener = (type: string, listener: Function) => {
        let listeners = this.listeners;
        let listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            let index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }
    public dispatch = (type: string) => {
        let listeners = this.listeners;
        let listenerArray = listeners[type];
        if(listenerArray !== undefined) {
            let array = listenerArray.slice(0);
            for(let i = 0; i < array.length; i++) {
                array[i]();
            }
        }
    }
    public dispatchEvent = (event:Event) => {
        let listeners = this.listeners;
        let listenerArray = listeners[event.type];
        if(listenerArray !== undefined) {
            // event.target = this;
            let array = listenerArray.slice(0);
            for(let i = 0; i < array.length; i++) {
                array[i].call(event.target, event);
            }
        }
    }
}

export {Observer};