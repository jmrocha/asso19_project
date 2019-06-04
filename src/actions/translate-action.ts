import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { Action } from './action';

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
