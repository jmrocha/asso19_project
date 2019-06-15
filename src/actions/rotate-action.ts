import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { UndoableAction } from './undoable-action';

export class RotateAction implements UndoableAction<void> {
  oldRotation = 0;

  constructor(
    private doc: SimpleDrawDocument,
    public shape: Shape,
    private rotation: number
  ) {}

  do(): void {
    this.oldRotation = this.shape.rotation;
    this.shape.rotation = this.rotation;
  }

  undo() {
    this.shape.rotation = this.oldRotation;
  }

  setOldRotation(oldRotation: number) {
    this.oldRotation = oldRotation;
  }

  toJSON(docID: number, toDo: boolean): string {
    return JSON.stringify({
      docID,
      type: 'RotateAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      rotation: this.rotation,
      oldRotation: this.oldRotation,
    });
  }
}
