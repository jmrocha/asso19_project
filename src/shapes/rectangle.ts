import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Rectangle extends Shape {
  constructor(
    id: number,
    x: number,
    y: number,
    public width: number,
    public height: number
  ) {
    super(id, new Coordinate(x, y));
  }

  accept(visitor: Visitor): Element {
    return visitor.visitRectangle(this);
  }
}
