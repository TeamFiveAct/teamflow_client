// src/redux/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/types';

interface TaskState {
  tasks: Task[];
  nextID: number;
}

const initialState: TaskState = {
  tasks: [],
  nextID: 1,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initializeTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.nextID =
        action.payload.length > 0
          ? action.payload[action.payload.length - 1].todo_id + 1
          : 1;
    },
    createTask: (state, action: PayloadAction<Omit<Task, 'todo_id'>>) => {
      const newTask: Task = {
        ...action.payload,
        todo_id: state.nextID,
      };
      state.tasks.push(newTask);
      state.nextID += 1;
    },
    updateTask: (
      state,
      action: PayloadAction<{
        todo_id: number;
        title?: string;
        description?: string;
        priority?: 'small' | 'medium' | 'high' | 'very_high';
        state?: 'open' | 'in_progress' | 'done';
        start_date?: string;
        due_date?: string;
      }>,
    ) => {
      const taskIndex = state.tasks.findIndex(
        task => task.todo_id === action.payload.todo_id,
      );
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload,
        };
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.todo_id !== action.payload);
    },
  },
});

export const { initializeTasks, createTask, updateTask, deleteTask } =
  taskSlice.actions;
export default taskSlice.reducer;
