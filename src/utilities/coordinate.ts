export class Coordinate {
    x: number;
    y: number;

    constructor(coordinate: number[]) {
      this.x = coordinate[0];
      this.y = coordinate[1];
    }

    setCoordinates(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    toString(): string {
      return 'X: ' + this.x + ' Y: ' + this.y;
    }
}