import { Shape } from './shape';

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
