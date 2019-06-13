import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Circle extends Shape {
  constructor(id: number, x: number, y: number, public radius: number) {
    super(id, new Coordinate(x, y));
  }
}
