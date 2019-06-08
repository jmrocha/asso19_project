import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export class Circle extends Shape {
  constructor(x: number, y: number, public radius: number) {
    super(new Coordinate(x, y));
  }

  accept(visitor: Visitor): string {
    return visitor.visitCircle(this);
  }
}
