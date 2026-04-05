const STORAGE_KEY = 'jirael_board';

export function loadBoardState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return { board: JSON.parse(raw) };
  } catch {
    return undefined;
  }
}

export const localStorageMiddleware = (store: { getState: () => { board: unknown } }) => (next: (action: unknown) => unknown) => (action: unknown) => {
  const result = next(action);
  try {
    const state = store.getState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.board));
  } catch {
    // ignore write errors
  }
  return result;
};
