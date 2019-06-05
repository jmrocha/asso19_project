import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { Action } from './action';

export class PaintAction implements Action<void> {
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
}
