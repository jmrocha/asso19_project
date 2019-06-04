import { Shape } from './shape';

export class Circle extends Shape {
  constructor(public x: number, public y: number, public radius: number) {
    super(x, y);
  }
}
