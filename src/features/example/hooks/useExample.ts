// Discriminated union state — all hooks must follow this pattern
type ExampleState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: unknown[] };

export function useExample(): ExampleState {
  // call RTK Query here, map to discriminated union
  return { status: 'loading' };
}
