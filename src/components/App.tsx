import './App.css';
import React, { useState, useRef, useEffect, useCallback } from "react";
import _ from 'lodash';
import * as yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { IState, IStatusState, ITodo, Status } from "../types/data";
import { addTask, addTasks, makeReserved, makeCompleted, removeCompleted } from "../slices/todosSlice";
import { setStatus } from '../slices/filterBySlice';
import cn from 'classnames';

const App = () => {
  const items = useSelector((state: IState) => state.todos.entities);
  const status = useSelector((state: { status: IStatusState }) => state.status.status);
  const existingNames = items.map((el) => el.title);
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const inputField = useRef<HTMLInputElement | null>(null);
  const lastTask = useRef<HTMLLIElement | null>(null); 

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      dispatch(addTasks(JSON.parse(savedTasks)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (lastTask.current) lastTask.current.scrollIntoView({ behavior: 'smooth', block: 'end'})
    if (inputField.current) inputField.current.focus();
  }, [items.length]);

  const scheme = yup.object({
    title: yup
      .string()
      .min(3, 'Название задачи должно содержать минимум 3 символа')
      .max(215, 'Название задачи не должно превышать 215 символов')
      .required('Отсутствует название задачи')
      .notOneOf(existingNames, 'Задача с таким именем уже существует')
  });

  const checkAndAddTask = useCallback(() => {
    scheme.validate({ title: taskName })
      .then((validatedTitle: { title: string }) => {
        const { title } = validatedTitle;
        dispatch(addTask({ id: parseInt(_.uniqueId()), title, status: 'inactive' }));
        setTaskName('');
        setErrMsg('');
      })
      .catch((e: Error) => {
        console.log(e.message);
        setErrMsg(e.message);
      });
  }, [dispatch, items.length, scheme, taskName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAndAddTask();
    }
  };

  function changeStatus(status: 'active' | 'inactive', id: number, developer?: string): void {
    switch (status) {
      case 'inactive':
        dispatch(makeReserved({ id, developer }));
        break;
      case 'active':
        dispatch(makeCompleted({ id, developer }));
        break;
      default:
        console.error(`Change status of this task isn't possible. status: ${status}\n`);
        return;
    }
  }
  
  const renderItems = () => {
    let filteredItems = items;
    switch (status) {
      case Status.All:
        break;
      case Status.Active:
        filteredItems = items.filter((item: ITodo) => item.status === 'active');
        break;
      case Status.Completed:
        filteredItems = items.filter((item: ITodo) => item.status === 'completed');
        break;
      default:
        console.error('Status was not recognized');
        return null;
    }

    return filteredItems.map((item: ITodo) => (
      <li key={item.id} className={cn('todo-list__item', {
        inactive: item.status === 'inactive',
        active: item.status === 'active',
        completed: item.status === 'completed',
      })}
      ref={item.id === filteredItems.at(-1)?.id ? lastTask : null}>
        <div className='item__body'>
          <p>{item.title}</p>
          {
          (item.status === 'active' || item.status === 'inactive') ?
          <button className='btn-confirm' onClick={() => changeStatus(item.status as 'active' | 'inactive', item.id!, item.developer!)}>
            {item.status === 'active' ? 'done?' : 'take it'}
          </button> : null
        }
        </div>
      </li>
    )
  );
  };

  return (
    <main>
      <div className="main-container">
        <div>
          {errMsg && <p className="error-message">{errMsg}</p>}
        </div>
        <h2><a className='title' href="/" target='#' rel="noopener noreferrer">todos</a></h2>
        <div className="list-container">
          <div className='todo-list__body'>
            <div className="form-control">
              <input
                className='task-input'
                type="text"
                value={taskName}
                onKeyDown={handleKeyDown}
                onChange={(e) => setTaskName(e.target.value)}
                ref={inputField}
                placeholder='What needs to be done?'
              />
            </div>
            <ul className='todo-list'>
              {renderItems()} 
            </ul>
            <div className="todo-list__footer">
              <p className='todos-left'>{renderItems()!.length} {renderItems()!.length > 1 ? 'items left' : `item left`}</p>
              <button
                type='button'
                className={cn('todo-btn', { selected: status === Status.All })}
                onClick={() => {
                  dispatch(setStatus(Status.All));
                }}>
                All
              </button>
              <button
                type='button'
                className={cn('todo-btn', { selected: status === Status.Active })}
                onClick={() => {
                  dispatch(setStatus(Status.Active));
                }}>
                Active
              </button>
              <button
                type='button'
                className={cn('todo-btn', { selected: status === Status.Completed })}
                onClick={() => {
                  dispatch(setStatus(Status.Completed));
                }}>
                Completed
              </button>
              <button type='button' className='reset-button' onClick={() => dispatch(removeCompleted({status: 'completed'}))}>
                <svg viewBox='0 0 20 20' width={14} height={14}>
                  <circle r="6" cx="10" cy="12" fill="none" stroke="grey" strokeWidth="2" strokeDasharray="16 10"/>
                  <polygon points="3,8 10,10 10,3" fill='grey'/>
                </svg>
                <div className="reset-button__tooltip">Remove completed</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { App };
