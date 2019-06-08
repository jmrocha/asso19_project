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
  objId = 0;
  renders: Render[] = [];
  currentRender: Render;

  constructor(public docID: number, public client: MqttClient, render: Render) {
    client.on('connect', () => {
      client.subscribe({'ASSOSimpleDraw': {qos: 1}}, err => {
        if (!err) {
          client.publish(
            'ASSOSimpleDraw',
            'Document with ID ' + this.docID + ' has connected!',
            {
              qos: 1,
            }
          );
        }
      });
    });

    this.currentRender = render;
    this.renders.push(render);
  }

  setCurrentRender(render: Render) {
    this.currentRender = render;
  }

  registerRender(render: Render) {
    this.renders.push(render);
  }

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
    this.currentRender.draw(...this.objects);
  }

  draw(): void {
    this.currentRender.draw(...this.objects);
  }

  remove(s: Shape): void {
    this.objects = this.objects.filter(o => o !== s);
    this.renders.forEach(render => render.remove(s));
  }

  add(r: Shape): void {
    this.objects.push(r);
    this.objId++;
  }

  do<T>(a: Action<T>): T {
    if ((a as UndoableAction<T>).undo !== undefined) {
      this.undoManager.onActionDone(a as UndoableAction<T>);
      this.client.publish(
        'ASSOSimpleDraw',
        (a as UndoableAction<T>).toJSON(this.docID),
        {
          qos: 1,
        }
      );
    }
    return a.do();
  }

  createRectangle(x: number, y: number, width: number, height: number): Shape {
    return this.do(
      new CreateRectangleAction(this, this.objId, x, y, width, height)
    );
  }

  createCircle(x: number, y: number, radius: number): Shape {
    return this.do(new CreateCircleAction(this, this.objId, x, y, radius));
  }

  createTriangle(p1: Coordinate, p2: Coordinate, p3: Coordinate): Shape {
    return this.do(new CreateTriangleAction(this, this.objId, p1, p2, p3));
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
