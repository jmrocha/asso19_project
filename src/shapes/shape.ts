import { Coordinate } from '../utilities/coordinate';

export abstract class Shape {
  coordinates: Coordinate[];
  rotation = 0;
  scaleX = 1;
  scaleY = 1;

  protected constructor(...coordinates: Coordinate[]) {
    this.coordinates = coordinates;
  }

  translate(deltaX: number, deltaY: number): void {
    this.coordinates.forEach(element => {
      element.x += deltaX;
      element.y += deltaY;
    });
  }

}
