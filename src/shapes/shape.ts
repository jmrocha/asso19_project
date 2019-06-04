export abstract class Shape {
  constructor(public x: number, public y: number) {}
}

export class Rectangle extends Shape {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super(x, y);
  }
}

export class Circle extends Shape {
  constructor(public x: number, public y: number, public radius: number) {
    super(x, y);
  }
}
