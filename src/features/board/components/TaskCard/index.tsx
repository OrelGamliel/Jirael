import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types/types';
import { Badge } from '../../../../common/components';
import { Button } from '../../../../common/components';
import { StyledCard, StyledCardTitle, StyledCardDescription, StyledCardFooter } from './styles';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { columnId: task.columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <StyledCard ref={setNodeRef} style={style} $isDragging={isDragging} {...attributes} {...listeners}>
      <StyledCardTitle>{task.title}</StyledCardTitle>
      {task.description && <StyledCardDescription>{task.description}</StyledCardDescription>}
      <StyledCardFooter>
        <Badge priority={task.priority} />
        <Button
          variant="ghost"
          size="sm"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          ✕
        </Button>
      </StyledCardFooter>
    </StyledCard>
  );
}
