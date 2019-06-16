import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Polygon extends Shape {
  constructor(id: number, ...coordinates: Coordinate[]) {
    super(id, ...coordinates);
  }

  accept(visitor: Visitor): Element {
    return visitor.visitPolygon(this);
  }
}
