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

  toJSON(docID: number, toDo: boolean): string {
    return JSON.stringify({
      docID,
      type: 'CreateTriangleAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      p1X: this.p1.x,
      p1Y: this.p1.y,
      p2X: this.p2.x,
      p2Y: this.p2.y,
      p3X: this.p3.x,
      p3Y: this.p3.y,
    });
  }
}
