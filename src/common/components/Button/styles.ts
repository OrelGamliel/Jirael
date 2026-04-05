import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

export const StyledButton = styled.button<{ $variant: Variant; $size: Size }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.15s, background 0.15s;

  ${({ $size, theme }) =>
    $size === 'sm'
      ? css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.fontSize.sm};
        `
      : css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSize.md};
        `}

  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    css`
      background: ${theme.colors.primary};
      color: #fff;
      &:hover:not(:disabled) {
        opacity: 0.88;
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'secondary' &&
    css`
      background: ${theme.colors.border};
      color: ${theme.colors.text};
      &:hover:not(:disabled) {
        opacity: 0.8;
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'ghost' &&
    css`
      background: transparent;
      color: ${theme.colors.textMuted};
      &:hover:not(:disabled) {
        background: ${theme.colors.border};
        color: ${theme.colors.text};
      }
    `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
