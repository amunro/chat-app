import WebSocket from 'ws';

import { Events } from './events'
import { State } from './messages/types'
import { executeMessage, clearAllReminders } from './messages/controller'
import Parser from './parser/controller'

// Websocket wrapper
export default (ws: WebSocket) => {
  const state: State = { nextId: 1, reminders: [], tacos: 0 };
  Events.setWS(ws);
  
  ws.on('message', (rawMessage) => {
    const message = Parser(rawMessage.toString());
    executeMessage(state, message);
  });

  ws.on('close', () => {
    clearAllReminders(state);
  });
  
  ws.send('Greetings, friend! Type <tt>help</tt> to get started.');

};

Events.on('send-message', (message: String) => {
  Events.ws.send(message)
});
