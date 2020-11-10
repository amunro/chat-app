import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import { Events } from './events'
import { State } from './messages/types'
import { executeMessage, clearAllReminders } from './messages/controller'
import Parser from './parser/controller'

// Websocket wrapper
export default (ws: WebSocket) => {
 
  const userId = uuid();
  const state: State = { userId, nextId: 1, reminders: [], tacos: 0 };

  Events.addClient(userId, ws);
  Events.emitMessage(userId, 'Greetings, friend! Type <tt>help</tt> to get started.');

  ws.on('message', (rawMessage) => {
    const message = Parser(rawMessage.toString());
    let response;
    try {
      response = executeMessage(state, message);
      Events.emitMessage(userId, response);
    } catch (e) {
      Events.emitMessage(userId, 'Sorry, I didn\'t quite get that.  Type <tt>help</tt> to see a list of commands.');
    }
  });

  ws.on('close', () => {
    Events.removeClient(state.userId)
    clearAllReminders(state);
  });  

};

// I wanted to create a clearer boundary between the websocket layer 
// and the application. While it may seem a bit superfluious here, 
// this saves us from passing through the `ws` properly into the 
// callbacks for the scheduled reminders and allows us to better 
// transition this code into a worker pattern or alternate service
// should the websockets require dedicated infra resourcing
Events.on('send-message', Events.processEvent);
