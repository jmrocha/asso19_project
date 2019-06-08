import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Circle } from '../shapes/circle';

export class CreateCircleAction extends CreateShapeAction<Circle> {
  constructor(
    doc: SimpleDrawDocument,
    private x: number,
    private y: number,
    private radius: number
  ) {
    super(doc, new Circle(x, y, radius));
  }
  
  toJSON(): string {
    return JSON.stringify({ type: 'CreateCircleAction', x: this.x, y: this.y, radius: this.radius });
  }
}
