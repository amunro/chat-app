const EventEmitter = require('events');

class Emitter extends EventEmitter {}

export const Events = new Emitter();