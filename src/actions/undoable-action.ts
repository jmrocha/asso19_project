import { Action } from './action';

export interface UndoableAction<S> extends Action<S> {
  do(): S;
  undo(): void;
  toJSON(docID: number): string;
}
