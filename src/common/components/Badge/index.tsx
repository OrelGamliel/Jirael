import styled, { css } from 'styled-components';

type Priority = 'low' | 'medium' | 'high';

const StyledBadge = styled.span<{ $priority: Priority }>`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;

  ${({ $priority }) =>
    $priority === 'low' &&
    css`
      background: #d1fae5;
      color: #065f46;
    `}

  ${({ $priority }) =>
    $priority === 'medium' &&
    css`
      background: #fef3c7;
      color: #92400e;
    `}

  ${({ $priority }) =>
    $priority === 'high' &&
    css`
      background: #fee2e2;
      color: #991b1b;
    `}
`;

interface BadgeProps {
  priority: Priority;
}

export function Badge({ priority }: BadgeProps) {
  return <StyledBadge $priority={priority}>{priority}</StyledBadge>;
}
