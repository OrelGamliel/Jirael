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

export type BoardWidgetState =
  | { status: 'ready'; columns: Column[]; tasks: Task[]; onAddTask: (payload: AddTaskPayload) => void; onMoveTask: (taskId: string, toColumnId: ColumnId) => void; onDeleteTask: (taskId: string) => void };

export interface AddTaskPayload {
  title: string;
  description?: string;
  columnId: ColumnId;
  priority: 'low' | 'medium' | 'high';
}
