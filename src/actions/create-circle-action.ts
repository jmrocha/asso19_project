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
}
