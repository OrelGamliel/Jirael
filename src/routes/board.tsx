import { createFileRoute } from '@tanstack/react-router';
import { BoardWidget } from '../features/board';

export const Route = createFileRoute('/board')({
  component: BoardWidget,
});
