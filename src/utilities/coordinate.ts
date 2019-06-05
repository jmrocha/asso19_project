export class Coordinate {
    x: number;
    y: number;

    constructor(coordinate: number[]) {
      this.x = coordinate[0];
      this.y = coordinate[1];
    }
}