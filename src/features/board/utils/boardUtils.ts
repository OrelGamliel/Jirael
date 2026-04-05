import type { Task, ColumnId } from '../types/types';

export function getTasksByColumn(tasks: Task[], columnId: ColumnId): Task[] {
  return tasks.filter((t) => t.columnId === columnId);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
