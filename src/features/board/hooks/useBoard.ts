import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { addTask, moveTask, deleteTask } from '../state/boardSlice';
import { DEFAULT_COLUMNS } from '../constants';
import type { BoardWidgetState, ColumnId, AddTaskPayload } from '../types/types';

export function useBoard(): BoardWidgetState {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.board.tasks);

  const handleAddTask = (payload: AddTaskPayload) => {
    dispatch(addTask(payload));
  };

  const handleMoveTask = (taskId: string, toColumnId: ColumnId) => {
    dispatch(moveTask({ taskId, toColumnId }));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask({ taskId }));
  };

  return {
    status: 'ready',
    columns: DEFAULT_COLUMNS,
    tasks,
    onAddTask: handleAddTask,
    onMoveTask: handleMoveTask,
    onDeleteTask: handleDeleteTask,
  };
}
