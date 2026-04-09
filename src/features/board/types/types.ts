import { z } from 'zod';

export const COLUMN_IDS = ['todo', 'in_progress', 'in_review', 'done'] as const;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  columnId: z.enum(COLUMN_IDS),
  createdAt: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
});

export type Task = z.infer<typeof TaskSchema>;

export type ColumnId = (typeof COLUMN_IDS)[number];

export interface Column {
  id: ColumnId;
  label: string;
}

interface BoardHandlers {
  onAddTask: (payload: AddTaskPayload) => void;
  onMoveTask: (taskId: string, toColumnId: ColumnId) => void;
  onDeleteTask: (taskId: string) => void;
}

export type BoardWidgetState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | ({ status: 'empty'; columns: Column[]; tasks: Task[] } & BoardHandlers)
  | ({ status: 'success'; columns: Column[]; tasks: Task[] } & BoardHandlers);

export interface AddTaskPayload {
  title: string;
  description?: string;
  columnId: ColumnId;
  priority: 'low' | 'medium' | 'high';
}
