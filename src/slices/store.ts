import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todosSlice';
import statusReducer from './filterBySlice';

export default configureStore({
  reducer: {
    status: statusReducer,
    todos: todoReducer,
  }
})