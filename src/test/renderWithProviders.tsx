import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import { boardReducer } from '../features/board/state/boardSlice';
import { theme } from '../providers/theme';

export function createTestStore() {
  return configureStore({
    reducer: { board: boardReducer },
  });
}

export function renderWithProviders(ui: ReactNode) {
  const store = createTestStore();

  const result = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>,
  );

  return { ...result, store };
}
