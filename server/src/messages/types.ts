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

export interface ExecutorInterface { 
    [key: string]: ActionMapInterface; 
}
interface ActionMapInterface { 
    [key: string]: ActionInterface; 
}
interface ActionInterface { 
    (state: State, message: MessageInterface): string;
}

// Types 

export type Reminder = {
  id: number;
  date: Date;
  text: string;
  timeout: NodeJS.Timeout;
};

export type State = {
  userId: string;
  reminders: Reminder[];
  nextId: number;
  tacos: number;
};