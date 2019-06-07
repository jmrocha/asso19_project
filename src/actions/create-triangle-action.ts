import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Triangle } from '../shapes/triangle';
import { Coordinate } from 'utilities/coordinate';

export class CreateTriangleAction extends CreateShapeAction<Triangle> {
  constructor(
    doc: SimpleDrawDocument,
    id: number,
    private p1: Coordinate,
    private p2: Coordinate,
    private p3: Coordinate
  ) {
    super(doc, new Triangle(id, p1, p2, p3));
  }
}
