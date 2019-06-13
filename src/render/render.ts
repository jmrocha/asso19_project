import { Shape } from '../shapes/shape';

export abstract class Render {
  protected constructor(public name: string) {}
  draw(...objs: Shape[]): void {
    this.destroy();
    this.init();
    this.drawObjects(...objs);
  }

  abstract drawObjects(...objs: Shape[]): void;
  abstract remove(obj: Shape): void;
  abstract init(): void;
  abstract destroy(): void;
}
