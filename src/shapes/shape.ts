import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export abstract class Shape {
  coordinates: Coordinate[];
  rotation = 0;
  scaleX = 1;
  scaleY = 1;
  fillColor = 'white';

  protected constructor(...coordinates: Coordinate[]) {
    this.coordinates = coordinates;
  }

  abstract accept(visitor: Visitor): string;
}
