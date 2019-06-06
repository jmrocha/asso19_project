import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { Action } from './action';

export class RotateAction implements Action<void> {
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
