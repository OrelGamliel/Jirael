import { Provider } from 'react-redux';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider } from 'styled-components';
import { store } from '../app/store';
import { router } from '../app/router';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';

export function AppProviders() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}
