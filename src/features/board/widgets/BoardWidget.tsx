import styled from 'styled-components';
import { DndContext, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useBoard } from '../hooks/useBoard';
import type { BoardWidgetState, ColumnId } from '../types/types';
import { Column } from '../components/Column';
import { getTasksByColumn } from '../utils/boardUtils';

const StyledBoard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  flex: 1;
`;

export function BoardWidgetContent(props: BoardWidgetState) {
  const { columns, tasks, onAddTask, onMoveTask, onDeleteTask } = props;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const toColumnId = over.id as ColumnId;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // `over` could be a column id or another task id — resolve the column
    const isColumn = columns.some((c) => c.id === toColumnId);
    if (isColumn && task.columnId !== toColumnId) {
      onMoveTask(taskId, toColumnId);
      return;
    }

    // `over` is a task — find which column that task belongs to
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && overTask.columnId !== task.columnId) {
      onMoveTask(taskId, overTask.columnId);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <StyledBoard>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(tasks, column.id)}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </StyledBoard>
    </DndContext>
  );
}

export function BoardWidget() {
  const state = useBoard();
  return <BoardWidgetContent {...state} />;
}
