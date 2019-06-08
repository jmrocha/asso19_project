import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Rectangle } from '../shapes/rectangle';

export class CreateRectangleAction extends CreateShapeAction<Rectangle> {
  constructor(
    doc: SimpleDrawDocument,
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {
    super(doc, new Rectangle(x, y, width, height));
  }

  toJSON(): string {
    return JSON.stringify({ type: 'CreateRectangleAction', x: this.x, y: this.y, width: this.width, height: this.height });
  }
}
