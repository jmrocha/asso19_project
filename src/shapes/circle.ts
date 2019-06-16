import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Circle extends Shape {
  constructor(id: number, x: number, y: number, public radius: number) {
    super(id, new Coordinate(x, y));
  }

  accept(visitor: Visitor): Element {
    return visitor.visitCircle(this);
  }
}
