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