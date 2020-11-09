import { ExecutorInterface, MessageInterface, State } from "./types";
import { Events } from './../events'

// A structure to define and scale out different callbacked based on an
// Object -> Action relationship. 
// Objects (the root keys of these structure - generic, reminder, tacos, ...) are 
//     sourced sent to the lexer. 
// Actions (the key -> function) pairing are referenced when the lexer has come  
//     across key words to signal such intent.
const callbacks: ExecutorInterface = {
    'generic': {
        help: function(state: State, message: MessageInterface) {
            return (
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
            return 'Hello there!';
        },
        thank: function(state: State, message: MessageInterface) {
            return 'You\'re welcome';
        },
        unknown: function(state: State, message: MessageInterface) {
            return 'Sorry! I don\'t understand what you mean.';
        }
    },
    'reminder': {
        add: function(state: State, message: MessageInterface) {

            if (!message.quantity || !message.text || !message.unit) {
                throw new Error('Missing one or more required fields');
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
                state.reminders = state.reminders.filter((r) => r.id !== id);
                Events.emit('send-message', `It is time to ${text}!`);
            }, seconds * 1000);

            state.reminders.push({ id, date, text, timeout });

            if (quantity > 1) {
                unit += 's';
            }

            return `Ok, I will remind you to ${text} in ${quantity} ${unit}.`;

        }, 
        delete: function(state: State, message: MessageInterface) {

            if (!message.modifier) {
                throw new Error('Missing one or more required fields');
            }

            if (message.modifier === 'all') {
                clearAllReminders(state);
                return "Ok, I have cleared all of your reminders.";
            } 

            const messageId = +message.modifier;
            const reminder = state.reminders.find((r) => r.id === messageId);

            if (!reminder) {
                return `There is no reminder with id ${messageId}.`;
            }

            clearTimeout(reminder.timeout);
            state.reminders = state.reminders.filter((r) => r !== reminder);

            return `Ok, I will not remind you to ${reminder.text}.`;

        }, 
        list: function(state: State, message: MessageInterface) {

            if (state.reminders.length === 0) {
                return "You have no reminders.";
            }

            const now = new Date().getTime();
            
            return (
                `<table border="1">
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

        },
    },
    'taco': {
        add: function(state: State, message: MessageInterface) {

            if (!message.modifier) {
                throw new Error('Missing one or more required fields');
            }

            const modifier = +message.modifier;
            state.tacos += modifier

            return `Ok! We've added ${modifier} taco(s)`;

        },
        list: function(state: State, message: MessageInterface) {
            return `You have ${state.tacos} incoming taco(s)! Woah mama!`;
        },
        delete: function(state: State, message: MessageInterface) {
            state.tacos = 0
            return `Ok! No more tacos, then!`;
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