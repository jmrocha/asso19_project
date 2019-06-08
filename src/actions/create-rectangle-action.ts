import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Rectangle } from '../shapes/rectangle';

export class CreateRectangleAction extends CreateShapeAction<Rectangle> {
  constructor(
    doc: SimpleDrawDocument,
    id: number,
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {
    super(doc, new Rectangle(id, x, y, width, height));
  }

  toJSON(docID: number): string {
    return JSON.stringify({
      docID,
      type: 'CreateRectangleAction',
      objectID: this.shape.getId,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
  }
}
