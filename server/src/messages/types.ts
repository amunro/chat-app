// Interfaces 

export interface GenericInterface {
  [propName: string]: any;
}

export interface MessageInterface extends GenericInterface {
  source: string;
  action: string;
  object?: string;
  text?: string;
  quantity?: number;
  modifier?: any;
  unit?: string;
}

// Types 

export type Reminder = {
  id: number;
  date: Date;
  text: string;
  timeout: NodeJS.Timeout;
};

export type State = {
  reminders: Reminder[];
  nextId: number;
  tacos: number;
};

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

export type Message = HelpMessage
             | AddReminderMessage
             | ListRemindersMessage
             | ClearAllRemindersMessage
             | ClearReminderMessage
             | UnknownMessage;