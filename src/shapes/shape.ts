import { Coordinate } from '../utilities/coordinate';

export abstract class Shape {
  coordinates: Coordinate[];

  protected constructor(...coordinates: Coordinate[]) {
    this.coordinates = coordinates;
  }
}
