import { Coordinate } from '../utilities/coordinate';
import { Visitor } from 'persistence/exporter';

export abstract class Shape {
  coordinates: Coordinate[];
  rotation = 0;
  scaleX = 1;
  scaleY = 1;
  fillColor = 'rgb(255, 255, 255)';
  strokeColor = 'rgb(0, 0, 0)';
  protected id = -1;

  protected constructor(id: number, ...coordinates: Coordinate[]) {
    this.id = id;
    this.coordinates = coordinates;
  }

  abstract accept(visitor: Visitor): Element;

  getId(): number {
    return this.id;
  }
}
