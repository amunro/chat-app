import WebSocket from 'ws';

import { Events } from './events'
import { State } from './messages/types'
import { executeMessage, clearAllReminders } from './messages/controller'
import Parser from './parser/controller'

// Websocket wrapper
export default (ws: WebSocket) => {
 
  const state: State = { nextId: 1, reminders: [], tacos: 0 };
  Events.setWS(ws);
  Events.emit('send-message', 'Greetings, friend! Type <tt>help</tt> to get started.');

  ws.on('message', (rawMessage) => {
    const message = Parser(rawMessage.toString());
    executeMessage(state, message);
  });

  ws.on('close', () => {
    clearAllReminders(state);
  });  

};

Events.on('send-message', (message: String) => {
  const response = JSON.stringify({ message })
  Events.ws.send(response)
});
