import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITodo } from '../types/data';


interface TodosState {
  entities: ITodo[];
  errors: string[],
}

const initialState: TodosState = {
  entities: [],
  errors: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTasks: (state, { payload }: PayloadAction<ITodo[]>) => {
      state.entities = [...state.entities, ...payload]
    },
    addTask: (state, { payload }: PayloadAction<ITodo>) => {
      state.entities.push(payload);
    },
    removeCompleted: (state) => {
      if (!state.entities.find((el) => el.status === 'completed')) return;
      const rest = state.entities.filter((el: ITodo) => el.status !== 'completed');
      state.entities = rest;
    },
    makeCompleted: (state, { payload }) => {
      const { id, developer } = payload;
      state.entities
        .filter((el: ITodo) => el.id === id)
        .map((el: ITodo) => {
          el.developer = developer;
          el.status = 'completed';
        });
    },
    makeReserved: (state, { payload }) => {
      const { id, developer } = payload;
      const task = state.entities.find((el: ITodo) => el.id === id);
      try {
        task!.status = 'active'
        task!.developer = developer;
      } catch (e) {
        console.warn(`Возникла проблема при взятии таска ${e}`);
      }
    },
    addError: (state, { payload }) => {
      const { error } = payload;
      state.errors.push(error);
    }
  }
});

export const { addTask, addTasks, addError, makeReserved, makeCompleted, removeCompleted } = todosSlice.actions;
export default todosSlice.reducer;