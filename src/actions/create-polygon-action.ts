import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Polygon } from '../shapes/polygon';
import { Coordinate } from 'utilities/coordinate';

export class CreatePolygonAction extends CreateShapeAction<Polygon> {
  constructor(doc: SimpleDrawDocument, id: number, private points: Coordinate) {
    super(doc, new Polygon(id, points));
  }

  toJSON(docID: number): string {
    return JSON.stringify({
      docID,
      type: 'CreatePolygonAction',
      points: JSON.stringify(this.points),
    });
  }
}
