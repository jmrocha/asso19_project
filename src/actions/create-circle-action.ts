import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Circle } from '../shapes/circle';

export class CreateCircleAction extends CreateShapeAction<Circle> {
  constructor(
    doc: SimpleDrawDocument,
    id: number,
    private x: number,
    private y: number,
    private radius: number
  ) {
    super(doc, new Circle(id, x, y, radius));
  }

  toJSON(docID: number, toDo: boolean): string {
    return JSON.stringify({
      docID,
      type: 'CreateCircleAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      x: this.x,
      y: this.y,
      radius: this.radius,
    });
  }
}
