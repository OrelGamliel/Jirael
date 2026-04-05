import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { StyledInput, StyledTextarea } from './styles';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <StyledInput {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <StyledTextarea {...props} />;
}
