import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AddTaskPayload, ColumnId } from '../../types/types';
import { COLUMN_LABELS, COLUMN_IDS } from '../../constants';
import { Button, Input, Textarea } from '../../../../common/components';
import { StyledForm, StyledLabel, StyledActions, StyledSelect } from './styles';

interface AddTaskFormProps {
  defaultColumnId: ColumnId;
  onSubmit: (payload: AddTaskPayload) => void;
  onCancel: () => void;
}

export function AddTaskForm({ defaultColumnId, onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, columnId, priority });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledLabel>
        Title *
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          autoFocus
        />
      </StyledLabel>

      <StyledLabel>
        Description
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
        />
      </StyledLabel>

      <StyledLabel>
        Column
        <StyledSelect value={columnId} onChange={(e) => setColumnId(e.target.value as ColumnId)}>
          {COLUMN_IDS.map((id) => (
            <option key={id} value={id}>
              {COLUMN_LABELS[id]}
            </option>
          ))}
        </StyledSelect>
      </StyledLabel>

      <StyledLabel>
        Priority
        <StyledSelect value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </StyledSelect>
      </StyledLabel>

      <StyledActions>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          Add Task
        </Button>
      </StyledActions>
    </StyledForm>
  );
}
