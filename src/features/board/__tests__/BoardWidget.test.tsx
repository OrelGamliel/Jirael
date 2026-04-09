import { screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ReactNode } from 'react';
import { BoardWidget } from '../widgets/BoardWidget';
import { renderWithProviders } from '../../../test/renderWithProviders';

// dnd-kit uses PointerEvent which jsdom does not fully support.
// We stub the drag-and-drop hooks so component structure renders correctly
// while move-task behavior is covered via Redux dispatch in the move tests.
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: ReactNode }) => <>{children}</>,
  DragOverlay: ({ children }: { children: ReactNode }) => <>{children}</>,
  closestCorners: undefined,
  useDroppable: () => ({ setNodeRef: () => {}, isOver: false }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: undefined,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

// ─── Helpers ────────────────────────────────────────────────────────────────

function setup() {
  return { user: userEvent.setup(), ...renderWithProviders(<BoardWidget />) };
}

async function seedTask(user: ReturnType<typeof userEvent.setup>, title: string, description?: string) {
  const [firstAddBtn] = screen.getAllByRole('button', { name: /add task/i });
  await user.click(firstAddBtn);
  await user.type(screen.getByPlaceholderText(/task title/i), title);
  if (description) {
    await user.type(screen.getByPlaceholderText(/optional description/i), description);
  }
  await user.click(screen.getByRole('button', { name: /^add task$/i }));
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('BoardWidget — user interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('shows all four columns on initial load', () => {
      setup();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('In Review')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('shows an "Add Task" button in every column', () => {
      setup();
      expect(screen.getAllByRole('button', { name: /add task/i })).toHaveLength(4);
    });
  });

  describe('Creating a task', () => {
    it('opens the add-task modal when clicking "+ Add Task"', async () => {
      const { user } = setup();
      const [firstAddBtn] = screen.getAllByRole('button', { name: /add task/i });
      await user.click(firstAddBtn);
      expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    });

    it('closes the modal when clicking Cancel', async () => {
      const { user } = setup();
      const [firstAddBtn] = screen.getAllByRole('button', { name: /add task/i });
      await user.click(firstAddBtn);
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByPlaceholderText(/task title/i)).not.toBeInTheDocument();
    });

    it('keeps the submit button disabled until a title is typed', async () => {
      const { user } = setup();
      const [firstAddBtn] = screen.getAllByRole('button', { name: /add task/i });
      await user.click(firstAddBtn);
      expect(screen.getByRole('button', { name: /^add task$/i })).toBeDisabled();
      await user.type(screen.getByPlaceholderText(/task title/i), 'Buy milk');
      expect(screen.getByRole('button', { name: /^add task$/i })).toBeEnabled();
    });

    it('does not submit when the title is only whitespace', async () => {
      const { user } = setup();
      const [firstAddBtn] = screen.getAllByRole('button', { name: /add task/i });
      await user.click(firstAddBtn);
      await user.type(screen.getByPlaceholderText(/task title/i), '   ');
      expect(screen.getByRole('button', { name: /^add task$/i })).toBeDisabled();
    });

    it('adds a task and displays it on the board', async () => {
      const { user } = setup();
      await seedTask(user, 'Fix login bug');
      expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    });

    it('closes the modal after a task is added', async () => {
      const { user } = setup();
      await seedTask(user, 'Setup CI');
      expect(screen.queryByPlaceholderText(/task title/i)).not.toBeInTheDocument();
    });

    it('adds a task with an optional description', async () => {
      const { user } = setup();
      await seedTask(user, 'Write tests', 'Cover all edge cases');
      expect(screen.getByText('Write tests')).toBeInTheDocument();
      expect(screen.getByText('Cover all edge cases')).toBeInTheDocument();
    });

    it('adds multiple tasks and shows all of them', async () => {
      const { user } = setup();
      const titles = ['Task Alpha', 'Task Beta', 'Task Gamma'];
      for (const title of titles) {
        await seedTask(user, title);
      }
      for (const title of titles) {
        expect(screen.getByText(title)).toBeInTheDocument();
      }
    });

    it('increments the task count in the column header', async () => {
      const { user } = setup();
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
      await seedTask(user, 'New task');
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Deleting a task', () => {
    it('removes the task from the board when ✕ is clicked', async () => {
      const { user } = setup();
      await seedTask(user, 'Removable task');
      expect(screen.getByText('Removable task')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: '✕' }));

      expect(screen.queryByText('Removable task')).not.toBeInTheDocument();
    });

    it('only removes the targeted task when multiple tasks exist', async () => {
      const { user } = setup();
      await seedTask(user, 'Keep me');
      await seedTask(user, 'Delete me');

      const deleteButtons = screen.getAllByRole('button', { name: '✕' });
      await user.click(deleteButtons[deleteButtons.length - 1]);

      expect(screen.getByText('Keep me')).toBeInTheDocument();
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    });

    it('decrements the task count after deletion', async () => {
      const { user } = setup();
      await seedTask(user, 'Temp task');
      expect(screen.getByText('1')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: '✕' }));

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('board is empty after deleting the only task', async () => {
      const { user } = setup();
      await seedTask(user, 'Solo task');
      await user.click(screen.getByRole('button', { name: '✕' }));
      expect(screen.queryByText('Solo task')).not.toBeInTheDocument();
      // All column counts back to 0
      expect(screen.getAllByText('0')).toHaveLength(4);
    });
  });

  describe('Moving a task', () => {
    it('updates the task columnId in the store when moveTask is dispatched', () => {
      const { store } = renderWithProviders(<BoardWidget />);

      store.dispatch({ type: 'board/addTask', payload: { title: 'Move me', columnId: 'todo', priority: 'medium' } });
      const taskId = store.getState().board.tasks[0].id;
      expect(store.getState().board.tasks[0].columnId).toBe('todo');

      store.dispatch({ type: 'board/moveTask', payload: { taskId, toColumnId: 'in_progress' } });

      expect(store.getState().board.tasks[0].columnId).toBe('in_progress');
    });

    it('reflects the new column in the UI after a move', async () => {
      const { user, store } = setup();

      await seedTask(user, 'Drag me');

      const taskId = store.getState().board.tasks[0].id;

      await act(async () => {
        store.dispatch({ type: 'board/moveTask', payload: { taskId, toColumnId: 'done' } });
      });

      // Task is still visible on the board
      expect(screen.getByText('Drag me')).toBeInTheDocument();

      // "Done" column now has count 1
      const doneHeading = screen.getByText('Done');
      const doneColumn = doneHeading.closest('div')!.parentElement!;
      expect(within(doneColumn).getByText('1')).toBeInTheDocument();
    });

    it('moving one task does not affect other tasks', () => {
      const { store } = renderWithProviders(<BoardWidget />);

      store.dispatch({ type: 'board/addTask', payload: { title: 'Stay', columnId: 'todo', priority: 'low' } });
      store.dispatch({ type: 'board/addTask', payload: { title: 'Travel', columnId: 'todo', priority: 'high' } });

      const travelId = store.getState().board.tasks.find((t) => t.title === 'Travel')!.id;
      store.dispatch({ type: 'board/moveTask', payload: { taskId: travelId, toColumnId: 'in_review' } });

      expect(store.getState().board.tasks.find((t) => t.title === 'Stay')!.columnId).toBe('todo');
    });

    it('can move a task through all columns sequentially', () => {
      const { store } = renderWithProviders(<BoardWidget />);

      store.dispatch({ type: 'board/addTask', payload: { title: 'Journey', columnId: 'todo', priority: 'medium' } });
      const taskId = store.getState().board.tasks[0].id;

      for (const col of ['in_progress', 'in_review', 'done'] as const) {
        store.dispatch({ type: 'board/moveTask', payload: { taskId, toColumnId: col } });
        expect(store.getState().board.tasks[0].columnId).toBe(col);
      }
    });
  });
});
