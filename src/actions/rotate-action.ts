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
}
