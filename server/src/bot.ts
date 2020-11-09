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
    let response;
    try {
      response = executeMessage(state, message);
      Events.emit('send-message', response);
    } catch (e) {
      Events.emit('send-message', 'Sorry, I didn\'t quite get that.  Type <tt>help</tt> to see a list of commands.');
    }
  });

  ws.on('close', () => {
    clearAllReminders(state);
  });  

};

// I wanted to create a clearer boundary between the websocket layer 
// and the application. While it may seem a bit superfluious here, 
// this saves us from passing through the `ws` properly into the 
// callbacks for the scheduled reminders and allows us to better 
// transition this code into a worker pattern or alternate service
// should the websockets require dedicated infra resourcing
Events.on('send-message', (message: String) => {

  // I also wanted to switch comms over from strings to JSON for the 
  // sake of overall platform communication consistency and data
  // scalability 
  const response = JSON.stringify({ message })
  Events.ws.send(response)

});
