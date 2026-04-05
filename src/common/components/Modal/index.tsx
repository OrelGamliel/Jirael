import type { ReactNode } from 'react';
import { Button } from '../Button';
import { StyledOverlay, StyledPanel, StyledHeader, StyledTitle } from './styles';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <StyledOverlay onClick={onClose}>
      <StyledPanel onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledTitle>{title}</StyledTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </StyledHeader>
        {children}
      </StyledPanel>
    </StyledOverlay>
  );
}
