import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBoard } from '../hooks/useBoard';
import type { BoardWidgetState, ColumnId, Task } from '../types/types';
import { Column } from '../components/Column';
import { Badge } from '../../../common/components';
import { getTasksByColumn } from '../utils/boardUtils';
import {
  StyledCard,
  StyledCardTitle,
  StyledCardDescription,
  StyledCardFooter,
} from '../components/TaskCard/styles';

// ─── Styled ────────────────────────────────────────────────────────────────

const StyledBoard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  flex: 1;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const StyledSkeletonCol = styled.div`
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 280px;
  height: 400px;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const StyledErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.error};
  font-weight: 500;
`;

const StyledOverlayCard = styled(StyledCard)`
  cursor: grabbing;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  rotate: 1.5deg;
`;


export function BoardWidgetSkeleton() {
  return (
    <StyledBoard>
      {[0, 1, 2, 3].map((i) => (
        <StyledSkeletonCol key={i} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </StyledBoard>
  );
}

export function BoardWidgetError({ message }: { message: string }) {
  return (
    <StyledCenter>
      <StyledErrorMessage>Something went wrong: {message}</StyledErrorMessage>
    </StyledCenter>
  );
}


type ContentState = Extract<BoardWidgetState, { status: 'success' | 'empty' }>;

export function BoardWidgetContent(props: ContentState) {
  const { columns, tasks, onAddTask, onMoveTask, onDeleteTask } = props;
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === (event.active.id as string)) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const toColumnId = over.id as ColumnId;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isColumn = columns.some((c) => c.id === toColumnId);
    if (isColumn && task.columnId !== toColumnId) {
      onMoveTask(taskId, toColumnId);
      return;
    }

    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && overTask.columnId !== task.columnId) {
      onMoveTask(taskId, overTask.columnId);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

      <DragOverlay>
        {activeTask && (
          <StyledOverlayCard>
            <StyledCardTitle>{activeTask.title}</StyledCardTitle>
            {activeTask.description && (
              <StyledCardDescription>{activeTask.description}</StyledCardDescription>
            )}
            <StyledCardFooter>
              <Badge priority={activeTask.priority} />
            </StyledCardFooter>
          </StyledOverlayCard>
        )}
      </DragOverlay>
    </DndContext>
  );
}


export function BoardWidget() {
  const state = useBoard();

  switch (state.status) {
    case 'loading':
      return <BoardWidgetSkeleton />;
    case 'error':
      return <BoardWidgetError message={state.message} />;
    case 'empty':
    case 'success':
      return <BoardWidgetContent {...state} />;
  }
}
