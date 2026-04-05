import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, ColumnId, AddTaskPayload } from '../types/types';
import { DEFAULT_COLUMNS } from '../constants';
import { generateId } from '../utils/boardUtils';

interface BoardState {
  tasks: Task[];
}

const initialState: BoardState = {
  tasks: [],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<AddTaskPayload>) {
      state.tasks.push({
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description,
        columnId: action.payload.columnId,
        priority: action.payload.priority,
        createdAt: new Date().toISOString(),
      });
    },
    moveTask(state, action: PayloadAction<{ taskId: string; toColumnId: ColumnId }>) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.columnId = action.payload.toColumnId;
      }
    },
    deleteTask(state, action: PayloadAction<{ taskId: string }>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.taskId);
    },
  },
});

export const { addTask, moveTask, deleteTask } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
export { DEFAULT_COLUMNS };
