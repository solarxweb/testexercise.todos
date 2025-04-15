export type ITodo = {
  id?: string | null;
  date?: string;
  title?: string | '';
  developer?: string | null;
  status: 'inactive' | 'active' | 'completed';
};

export interface ITodosState {
  entities: ITodo[];
  errors: string[],
};

export interface IState {
  todos: ITodosState;
};

export enum Status {
  All = 'all',
  Active = 'active',
  Completed = 'completed'
};

export interface IStatusState {
  status: Status;
};
