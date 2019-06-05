import { Coordinate } from '../utilities/coordinate';

export abstract class Shape {
  coordinates: Coordinate[];

  protected constructor(...coordinates: Coordinate[]) {
    this.coordinates = coordinates;
  }

  translate(deltaX: number, deltaY: number): void {
    this.coordinates.forEach(element => {
      element.setCoordinates(element.x + deltaX, element.y + deltaY);
    });
  }

}
