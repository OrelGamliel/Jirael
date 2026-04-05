import styled from 'styled-components';
import { useExample } from '../hooks/useExample';

const StyledWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
`;

// Pure UI — Storybook targets this export
export function ExampleWidgetContent(props: ReturnType<typeof useExample>) {
  if (props.status === 'loading') return <StyledWrapper>Loading…</StyledWrapper>;
  if (props.status === 'error') return <StyledWrapper>Error: {props.error.message}</StyledWrapper>;
  return <StyledWrapper>Data: {JSON.stringify(props.data)}</StyledWrapper>;
}

// Container — calls hook, passes state down. Nothing else.
export function ExampleWidget() {
  const state = useExample();
  return <ExampleWidgetContent {...state} />;
}
