const EventEmitter = require('events');

class Emitter extends EventEmitter {

    ws: any;

    constructor() {
        super();
        this.ws = null;
    }

    setWS(ws: any) {
        this.ws = ws;
    }

}

export const Events = new Emitter();