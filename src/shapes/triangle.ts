import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Triangle extends Shape {
  constructor(p1: Coordinate, p2: Coordinate, p3: Coordinate) {
    super(p1, p2, p3);
  }
}
