const EventEmitter = require('events');

class Emitter extends EventEmitter {

    clients: any;

    constructor() {
        super();
        this.clients = new Map();
    }

    addClient(userId: string, ws: any) {
        this.clients.set(userId, ws);
    }

    removeClient(userId: string) {
        this.clients.delete(userId);
    }

    getClient(userId: string) {
        return this.clients.get(userId);
    }

    emitEvent(topic: string, data: any) {
        Events.emit(topic, {
            userId: data.userId,
            message: data.message
        });
    }

    emitMessage(userId: string, message: string){
        const data = {
            userId, 
            message
        }
        this.emitEvent('send-message', data);
    }

    processEvent(data: any) {

        // I also wanted to switch comms over from strings to JSON for the 
        // sake of overall platform communication consistency and data
        // scalability 
        const client = this.getClient(data.userId);
        const response = JSON.stringify({ message: data.message });
        client.send(response);

    }

}

export const Events = new Emitter();