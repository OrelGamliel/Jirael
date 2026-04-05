import styled from 'styled-components';

export const StyledColumn = styled.div<{ $isOver?: boolean }>`
  background: ${({ theme, $isOver }) => ($isOver ? theme.colors.border : theme.colors.background)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: background 0.15s;
  min-height: 200px;
`;

export const StyledColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const StyledColumnTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const StyledCount = styled.span`
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 2px ${({ theme }) => theme.spacing.sm};
`;

export const StyledCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;
