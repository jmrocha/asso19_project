import { Coordinate } from '../utilities/coordinate';

export abstract class Shape {
  coordinates: Coordinate[];
  rotation = 0;
  scaleX = 1;
  scaleY = 1;
  fillColor = 'white';
  protected id = -1;

  protected constructor(id: number, ...coordinates: Coordinate[]) {
    this.id = id;
    this.coordinates = coordinates;
  }

  getId(): number {
    return this.id;
  }
}
