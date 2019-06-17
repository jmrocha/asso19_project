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

  setOldFillColor(fillColor: string) {
    this.oldFillColor = fillColor;
  }

  toJSON(docID: number, toDo: boolean): string {
    return JSON.stringify({
      docID,
      type: 'PaintAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      fillColor: this.fillColor,
      oldFillColor: this.oldFillColor,
    });
  }
}
