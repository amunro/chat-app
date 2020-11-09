import { GenericInterface, MessageInterface, State } from "./types";
import { Events } from '../events'

const callbacks: GenericInterface = {
    'generic': {
        help: function(state: State, message: MessageInterface) {
            Events.emit('send-message', 
                `I am a reminder bot, here to help you get organized. Here are some of the things you can ask me to do:
                <ul>
                <li>Add reminders, e.g. <tt>remind me to make dinner in 5 minutes</tt>.</li>
                <li>List reminders, e.g. <tt>show all reminders</tt>.
                <li>Clear reminders, e.g. <tt>clear all reminders</tt> or <tt>clear reminder 3</tt>.
                </ul>
                At the moment I am not very sophisticated, but maybe you can help make me better!`
            );
        },
        greet: function(state: State, message: MessageInterface) {
            Events.emit('send-message', 'Hello there!');
        },
        thank: function(state: State, message: MessageInterface) {
            Events.emit('send-message', 'You\'re welcome');
        },
        unknown: function(state: State, message: MessageInterface) {
            Events.emit('send-message', 'Sorry! I don\'t understand what you mean.');
        }
    },
    'reminder': {
        add: function(state: State, message: MessageInterface) {

            if (!message.quantity || !message.text || !message.unit) {
                return new Error('Missing one or more required fields');
            }

            const quantity = message.quantity;
            const text = message.text
                .replace(/\bmy\b/g, 'your')
                .replace(/\bme\b/g, 'you');
            const id = state.nextId++;

            let unit = message.unit;
            let multipier = 1;

            if (unit === 'minute') {
                multipier = 60;
            } else if (unit === 'hour') {
                multipier = 3600;
            }

            const seconds = quantity * multipier; 

            const date = new Date();
            date.setSeconds(date.getSeconds() + seconds);

            const timeout = setTimeout(() => {
                Events.emit('send-message', `It is time to ${text}!`)
                state.reminders = state.reminders.filter((r) => r.id !== id);
            }, seconds * 1000);

            state.reminders.push({ id, date, text, timeout });

            if (quantity > 1) {
                unit += 's';
            }

            Events.emit('send-message', `Ok, I will remind you to ${text} in ${quantity} ${unit}.`);

            return;

        }, 
        delete: function(state: State, message: MessageInterface) {

            if (!message.modifier) {
                return new Error('Missing one or more required fields');
            }

            if (message.modifier === 'all') {

                clearAllReminders(state);
                Events.emit('send-message', "Ok, I have cleared all of your reminders.");
                return;

            } else {

                const messageId = +message.modifier;
                const reminder = state.reminders.find((r) => r.id === messageId);

                if (!reminder) {
                    Events.emit('send-message', `There is no reminder with id ${messageId}.`);
                    return;
                }

                clearTimeout(reminder.timeout);
                state.reminders = state.reminders.filter((r) => r !== reminder);

                Events.emit('send-message', `Ok, I will not remind you to ${reminder.text}.`);
                return;
                
            }

        }, 
        list: function(state: State, message: MessageInterface) {

            if (state.reminders.length === 0) {
                Events.emit('send-message', "You have no reminders.");
                return;
            }

            const now = new Date().getTime();
            
            Events.emit('send-message', `
                <table border="1">
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>seconds remaining</th>
                        <th>text</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${state.reminders
                        .map(({ id, date, text }) => `
                        <tr>
                            <td>${id}</td>
                            <td>${Math.round((date.getTime() - now) / 1000)}</td>
                            <td>${text}</td>
                        </tr>`)
                        .join("")}
                    </tbody>
                </table>`
            );
            return; 

        },
    },
    'taco': {
        add: function(state: State, message: MessageInterface) {

            if (!message.modifier) {
                return new Error('Missing one or more required fields');
            }

            const modifier = +message.modifier;
            state.tacos += modifier

            Events.emit('send-message', `Ok! We've added ${modifier} taco(s)`);
            return;

        },
        list: function(state: State, message: MessageInterface) {

            Events.emit('send-message', `You have ${state.tacos} incoming taco(s)! Woah mama!`);
            return;

        },
        delete: function(state: State, message: MessageInterface) {

            state.tacos = 0
            Events.emit('send-message', `Ok! No more tacos, then!`);
            return;

        }
    }
}

export function executeMessage(state: State, message: MessageInterface) {

    if (message.object && callbacks[message.object] && callbacks[message.object][message.action]) {
        return callbacks[message.object][message.action](state, message)
    } else if (callbacks.generic[message.action]) {
        return callbacks.generic[message.action](state, message);
    }

    return callbacks.generic.unknown(state, message);
}

export function clearAllReminders(state: State) {
  for (const { timeout } of state.reminders) {
    clearTimeout(timeout);
  }

  state.reminders = [];
}

export const objects = Object.keys(callbacks);