import WebSocket from 'ws';

import { Events } from './events'
import { State } from './messages/types'
import { clearAllReminders } from './messages/controller'
import Parser from './parser/controller'

// Websocket wrapper
export default (ws: WebSocket) => {
  const state: State = { nextId: 1, reminders: [] };

  ws.on('message', (rawMessage) => {
    const message = Parser(rawMessage.toString());
    console.log(message);
    //    const reply = executeMessage(state, message);
    //ws.send(reply);
  });

  ws.on('close', () => {
    clearAllReminders(state);
  });
  
  ws.send('Greetings, friend! Type <tt>help</tt> to get started.');

  Events.on('send-message', (message: String) => {
    ws.send(message)
  });
};
