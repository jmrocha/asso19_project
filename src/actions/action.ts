import { Shape, Circle, Rectangle } from '../shape';
import { SimpleDrawDocument } from '../document';
import { CreateShapeAction } from './create-shape-action';

export interface Action<T> {
  do(): T;
  undo(): void;
}

export class TranslateAction implements Action<void> {
  oldX = 0;
  oldY = 0;

  constructor(
    private doc: SimpleDrawDocument,
    public shape: Shape,
    private xd: number,
    private yd: number
  ) {}

  do(): void {
    this.oldX = this.shape.x;
    this.oldY = this.shape.y;
    this.doc.translate(this.shape, this.xd, this.yd);
  }

  undo() {
    this.shape.x = this.oldX;
    this.shape.y = this.oldY;
  }
}
