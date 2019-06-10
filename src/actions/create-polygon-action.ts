import { CreateShapeAction } from './create-shape-action';
import { SimpleDrawDocument } from '../document';
import { Polygon } from '../shapes/polygon';
import { Coordinate } from 'utilities/coordinate';

export class CreatePolygonAction extends CreateShapeAction<Polygon> {
  constructor(
    doc: SimpleDrawDocument,
    id: number,
    private points: Coordinate[]
  ) {
    super(doc, new Polygon(id, ...points));
  }

  toJSON(docID: number, toDo: boolean): string {
    const pointsString = '[]';
    const points = JSON.parse(pointsString);

    this.points.forEach((element) => {
      points.push({"x": + element.x, "y": + element.y});
    });

    return JSON.stringify({
      docID,
      type: 'CreatePolygonAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      points,
    });
  }
}
