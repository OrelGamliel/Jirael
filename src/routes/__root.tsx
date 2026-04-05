import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import styled from 'styled-components';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StyledLogo = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.5px;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StyledNavLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover,
  &[data-status='active'] {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const StyledMain = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Route = createRootRoute({
  component: () => (
    <StyledLayout>
      <StyledHeader>
        <StyledLogo>JIRAEL</StyledLogo>
        <StyledNav>
          <StyledNavLink to="/board">Board</StyledNavLink>
        </StyledNav>
      </StyledHeader>
      <StyledMain>
        <Outlet />
      </StyledMain>
    </StyledLayout>
  ),
});
