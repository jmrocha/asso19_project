import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number
  ) {
    super(new Coordinate(x, y));
  }
}
