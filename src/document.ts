import { Shape } from './shapes/shape';
import { Action } from './actions/action';
import { UndoableAction } from './actions/undoable-action';
import { Render } from './render/render';
import { CreateRectangleAction } from './actions/create-rectangle-action';
import { CreateTriangleAction } from './actions/create-triangle-action';
import { CreateCircleAction } from './actions/create-circle-action';
import { TranslateAction } from './actions/translate-action';
import { RotateAction } from './actions/rotate-action';
import { UndoManager } from './actions/undo-manager';
import { Coordinate } from 'utilities/coordinate';
import { ScaleAction } from 'actions/scale-action';
import { PaintAction } from 'actions/paint-action';
import { MqttClient } from 'mqtt';
import { inspect } from 'util';

export class SimpleDrawDocument {
  objects = new Array<Shape>();
  undoManager = new UndoManager();

  constructor(public client: MqttClient) {
    client.on('connect', () => {
      client.subscribe('ASSOSimpleDraw', err => {
        if(!err) {
          client.publish('ASSOSimpleDraw', 'Hello ASSO');
        }
      });
    });
  }

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
    if ((a as UndoableAction<T>).undo !== undefined) {
      this.undoManager.onActionDone(a as UndoableAction<T>);
      this.client.publish('ASSOSimpleDraw', (a as UndoableAction<T>).toJSON());
    }
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

  rotate(s: Shape, angleDegrees: number): void {
    return this.do(new RotateAction(this, s, angleDegrees));
  }

  scale(s: Shape, scaleX: number, scaleY: number): void {
    return this.do(new ScaleAction(this, s, scaleX, scaleY));
  }

  paint(s: Shape, fillColor: string): void {
    return this.do(new PaintAction(this, s, fillColor));
  }
}
