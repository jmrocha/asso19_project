import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { UndoableAction } from './undoable-action';

export class PaintAction implements UndoableAction<void> {
  oldFillColor = '';

  constructor(
    private doc: SimpleDrawDocument,
    public shape: Shape,
    private fillColor: string
  ) {}

  do(): void {
    this.oldFillColor = this.shape.fillColor;
    this.shape.fillColor = this.fillColor;
  }

  undo() {
    this.shape.fillColor = this.oldFillColor;
  }

  toJSON(): string {
    return JSON.stringify({ type: 'PaintAction', shape: JSON.stringify(this.shape), fillColor: this.fillColor });
  }
}
