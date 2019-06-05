import { Shape } from './shapes/shape';
import { Action } from './actions/action';
import { Render } from './render/render';
import { CreateRectangleAction } from './actions/create-rectangle-action';
import { CreateTriangleAction } from './actions/create-triangle-action';
import { CreateCircleAction } from './actions/create-circle-action';
import { TranslateAction } from './actions/translate-action';
import { UndoManager } from './actions/undo-manager';
import { Coordinate } from 'utilities/coordinate';

export class SimpleDrawDocument {
  objects = new Array<Shape>();
  undoManager = new UndoManager();

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
  }

  draw(render: Render): void {
    render.draw(...this.objects);
  }

  add(r: Shape): void {
    this.objects.push(r);
  }

  do<T>(a: Action<T>): T {
    this.undoManager.onActionDone(a);
    return a.do();
  }

  createRectangle(x: number, y: number, width: number, height: number): Shape {
    return this.do(new CreateRectangleAction(this, x, y, width, height));
  }

  createCircle(x: number, y: number, radius: number): Shape {
    return this.do(new CreateCircleAction(this, x, y, radius));
  }

  createTriangle(p1: Coordinate, p2: Coordinate, p3: Coordinate): Shape {
    return this.do(new CreateTriangleAction(this, p1, p2, p3));
  }

  translate(s: Shape, xd: number, yd: number): void {
    return this.do(new TranslateAction(this, s, xd, yd));
  }

  /*rotate(s: Shape, angleDegrees: number): void {
    return this.do(new RotateAction(this, s, angleDegrees));
  }*/
}
