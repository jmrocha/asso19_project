import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Polygon extends Shape {
  constructor(id: number, ...coordinates: Coordinate[]) {
    super(id, ...coordinates);
  }
}
