import { type Column, COLUMN_IDS } from '../types/types';

export { COLUMN_IDS };

export const COLUMN_LABELS: Record<(typeof COLUMN_IDS)[number], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

export const DEFAULT_COLUMNS: Column[] = COLUMN_IDS.map((id) => ({
  id,
  label: COLUMN_LABELS[id],
}));
