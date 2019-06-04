import { Shape } from '../shapes/shape';

export interface Render {
  draw(...objs: Shape[]): void;
}
