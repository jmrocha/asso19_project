import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Triangle } from '../shapes/triangle';
import { Coordinate } from 'utilities/coordinate';

export class CreateTriangleAction extends CreateShapeAction<Triangle> {
  constructor(
    doc: SimpleDrawDocument,
    private p1: Coordinate,
    private p2: Coordinate,
    private p3: Coordinate
  ) {
    super(doc, new Triangle(p1, p2, p3));
  }
  
  toJSON(): string {
    return JSON.stringify({ type: 'CreateTriangleAction', p1: JSON.stringify(this.p1), p2: JSON.stringify(this.p2), p3: JSON.stringify(this.p3) });
  }
}
