import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { UndoableAction } from './undoable-action';

export class ScaleAction implements UndoableAction<void> {
  oldScaleX = 0;
  oldScaleY = 0;

  constructor(
    private doc: SimpleDrawDocument,
    public shape: Shape,
    private scaleX: number,
    private scaleY: number
  ) {}

  do(): void {
    this.oldScaleX = this.shape.scaleX;
    this.oldScaleY = this.shape.scaleY;
    this.shape.scaleX = this.scaleX;
    this.shape.scaleY = this.scaleY;
  }

  undo() {
    this.shape.scaleX = this.oldScaleX;
    this.shape.scaleY = this.oldScaleY;
  }

  setOldScaling(oldScaleX: number, oldScaleY: number) {
    this.oldScaleX = oldScaleX;
    this.oldScaleY = oldScaleY;
  }

  toJSON(docID: number, toDo: boolean): string {
    return JSON.stringify({
      docID,
      type: 'ScaleAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      oldScaleX: this.oldScaleX,
      oldScaleY: this.oldScaleY,
    });
  }
}
