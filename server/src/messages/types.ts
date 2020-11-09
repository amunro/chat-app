// Message definitions

type HelpMessage = {
  kind: "help";
};

type AddReminderMessage = {
  kind: "add-reminder";
  text: string;
  seconds: number;
};

type ListRemindersMessage = {
  kind: "list-reminders";
};

type ClearAllRemindersMessage = {
  kind: "clear-all-reminders";
};

type ClearReminderMessage = {
  kind: "clear-reminder";
  id: number;
};

type UnknownMessage = {
  kind: "unknown";
};

export interface MessageInterface {
  action: string;
  object?: string;
  text?: string;
  quantity?: number;
  modifier?: string;
  unit?: string;
}

export type Message = HelpMessage
             | AddReminderMessage
             | ListRemindersMessage
             | ClearAllRemindersMessage
             | ClearReminderMessage
             | UnknownMessage;

export type Reminder = {
  id: number;
  date: Date;
  text: string;
  timeout: NodeJS.Timeout;
};

export type State = {
  reminders: Reminder[];
  nextId: number;
};