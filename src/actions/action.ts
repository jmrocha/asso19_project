export interface Action<T> {
  do(): T;
  undo(): void;
}
