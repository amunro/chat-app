import { Events } from '../events'
import { Message, State } from './types'
import { createParser } from '../parser';

export const parseMessage = createParser<Message>({
  intents: [
    {
      regexps: [
        /^help\.?$/i,
      ],
      func: () => ({ kind: 'help' }),
    },
    {
      regexps: [
        /^(?:remind|tell) me to (?<text>.*) in (?<quantity>\d+|a|an) (?<unit>(?:second|minute|hour)s?)\.?$/i,
        /^in (?<quantity>\d+|a|an) (?<unit>(?:second|minute|hour)s?),? (?:remind|tell) me to (?<text>.*)\.?$/i,
      ],
      func: ({ text, quantity, unit }) => {
        let seconds = quantity.startsWith("a") ? 1 : Number(quantity);

        if (unit.toLowerCase().startsWith("minute")) {
          seconds *= 60;
        } else if (unit.toLowerCase().startsWith("hour")) {
          seconds *= 3600;
        }

        return { kind: "add-reminder", seconds, text };
      },
    },
    {
      regexps: [
        /^(?:list|show|tell) (?:(?:me|all|of|my) )*reminders\.?$/i,
      ],
      func: () => ({ kind: "list-reminders" }),
    },
    {
      regexps: [
        /^(?:clear|delete|remove|forget) (?:(?:all|of|my) )*reminders\.?$/i,
      ],
      func: () => ({ kind: "clear-all-reminders" }),
    },
    {
      regexps: [
        /^(?:clear|delete|remove|forget) (?:reminder )?(?<id>\d+)\.?$/i,
      ],
      func: ({ id }) => ({ kind: "clear-reminder", id: Number(id) }),
    },
  ],
  fallback: { kind: "unknown" },
});

export function executeMessage(state: State, message: Message) {
  switch (message.kind) {
    case "help": {
      return `I am a reminder bot, here to help you get organized. Here are some of the things you can ask me to do:

<ul>
  <li>Add reminders, e.g. <tt>remind me to make dinner in 5 minutes</tt>.</li>
  <li>List reminders, e.g. <tt>show all reminders</tt>.
  <li>Clear reminders, e.g. <tt>clear all reminders</tt> or <tt>clear reminder 3</tt>.
</ul>

At the moment I am not very sophisticated, but maybe you can help make me better!`;
    }

    case "add-reminder": {
      const seconds = message.seconds;
      const text = message.text
        .replace(/\bmy\b/g, 'your')
        .replace(/\bme\b/g, 'you');

      const id = state.nextId++;

      const date = new Date();
      date.setSeconds(date.getSeconds() + seconds);

      const timeout = setTimeout(() => {
        Events.emit('send-message', `It is time to ${text}!`)
        state.reminders = state.reminders.filter((r) => r.id !== id);
      }, seconds * 1000);

      state.reminders.push({ id, date, text, timeout });

      const unit = seconds === 1 ? 'second' : 'seconds';
      return `Ok, I will remind you to ${text} in ${seconds} ${unit}.`;
    };

  case "list-reminders": {
    if (state.reminders.length === 0) {
      return "You have no reminders.";
    }

    const now = new Date().getTime();

    return `
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
      </table>`;
  }

  case "clear-all-reminders": {
    clearAllReminders(state);
    return "Ok, I have cleared all of your reminders.";
  }

  case "clear-reminder": {
    const reminder = state.reminders.find((r) => r.id === message.id);

    if (!reminder) {
      return `There is no reminder with id ${message.id}.`;
    }

    clearTimeout(reminder.timeout);
    state.reminders = state.reminders.filter((r) => r !== reminder);

    return `Ok, I will not remind you to ${reminder.text}.`;
  }

  case "unknown":
    return "I'm sorry, I don't understand what you mean.";
  }
}

export function clearAllReminders(state: State) {
  for (const { timeout } of state.reminders) {
    clearTimeout(timeout);
  }

  state.reminders = [];
}