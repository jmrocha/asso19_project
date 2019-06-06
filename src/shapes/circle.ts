import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Circle extends Shape {
  constructor(x: number, y: number, public radius: number) {
    super(new Coordinate(x, y));
  }
}
