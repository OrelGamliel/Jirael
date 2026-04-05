import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task, ColumnId, AddTaskPayload } from '../../types/types';
import { TaskCard } from '../TaskCard';
import { AddTaskForm } from '../AddTaskForm';
import { Modal } from '../../../../common/components';
import { Button } from '../../../../common/components';
import {
  StyledColumn,
  StyledColumnHeader,
  StyledColumnTitle,
  StyledCount,
  StyledCardList,
} from './styles';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (payload: AddTaskPayload) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Column({ column, tasks, onAddTask, onDeleteTask }: ColumnProps) {
  const [showModal, setShowModal] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const taskIds = tasks.map((t) => t.id);

  const handleAdd = (payload: AddTaskPayload) => {
    onAddTask({ ...payload, columnId: column.id as ColumnId });
    setShowModal(false);
  };

  return (
    <>
      <StyledColumn $isOver={isOver}>
        <StyledColumnHeader>
          <StyledColumnTitle>{column.label}</StyledColumnTitle>
          <StyledCount>{tasks.length}</StyledCount>
        </StyledColumnHeader>

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <StyledCardList ref={setNodeRef}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))}
          </StyledCardList>
        </SortableContext>

        <Button variant="ghost" size="sm" onClick={() => setShowModal(true)}>
          + Add Task
        </Button>
      </StyledColumn>

      {showModal && (
        <Modal title={`Add task to ${column.label}`} onClose={() => setShowModal(false)}>
          <AddTaskForm
            defaultColumnId={column.id as ColumnId}
            onSubmit={handleAdd}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
}
