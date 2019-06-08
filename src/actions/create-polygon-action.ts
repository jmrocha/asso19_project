import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Polygon } from '../shapes/polygon';
import { Coordinate } from 'utilities/coordinate';

export class CreatePolygonAction extends CreateShapeAction<Polygon> {
  constructor(doc: SimpleDrawDocument, private points: Coordinate) {
    super(doc, new Polygon(points));
  }
  
  toJSON(): string {
    return JSON.stringify({ type: 'CreatePolygonAction', points: JSON.stringify(this.points) });
  }
}
