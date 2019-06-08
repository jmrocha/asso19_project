import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Polygon extends Shape {
  constructor(...coordinates: Coordinate[]) {
    super(...coordinates);
  }

  accept(visitor: Visitor): string {
    return visitor.visitPolygon(this);
  }
}
