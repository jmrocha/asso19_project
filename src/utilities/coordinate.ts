export class Coordinate {
    constructor(public x: number, public y: number) {
      this.x = x;
      this.y = y;
    }

    setCoordinates(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    toString(): string {
      return 'X: ' + this.x + ' Y: ' + this.y;
    }
}