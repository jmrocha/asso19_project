export interface UndoableAction<S> {
  do(): S;
  undo(): void;
}
