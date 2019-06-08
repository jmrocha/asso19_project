import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number
  ) {
    super(new Coordinate(x, y));
  }

  accept(visitor: Visitor): string {
    return visitor.visitRectangle(this);
  }
}
