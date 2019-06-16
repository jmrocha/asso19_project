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
import {
  Context,
  ConcreteStrategyXMLExp,
  ConcreteStrategyJSONExp,
  ConcreteStrategyXMLImp,
  ConcreteStrategyJSONImp,
} from 'persistence/exporter';

import { CreatePolygonAction } from './actions/create-polygon-action';
import { MqttClient } from 'mqtt';
import { SyncManager } from './utilities/sync-manager';
import { ChangeRenderAction } from './actions/change-render-action';

export class SimpleDrawDocument {
  objects = new Array<Shape>();
  undoManager = new UndoManager();
  objId = 0;
  renders: Map<string, Render> = new Map<string, Render>();
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  currentRender: Render;
  syncManager: SyncManager = new SyncManager(this.client, this.docID);

  constructor(public docID: number, public client: MqttClient, render: Render) {
    client.on('connect', () => {
      client.subscribe(
        { ASSOSimpleDraw: { qos: 1 }, ASSOSimpleDrawSync: { qos: 1 } },
        err => {
          if (!err) {
            client.publish(
              'ASSOSimpleDraw',
              'Document with ID ' + this.docID + ' has connected!',
              {
                qos: 1,
              }
            );
            client.publish(
              'ASSOSimpleDrawSync',
              JSON.stringify(
                JSON.parse(
                  '{ "docID": ' + this.docID + ', "type": "SYNC_REQUEST" }'
                )
              ),
              {
                qos: 1,
              }
            );
          }
        }
      );
    });

    this.setCurrentRender(render);
    this.renders.set(render.name, render);
  }

  setCurrentRender(render: Render) {
    // remove old render if exists
    if (this.currentRender) {
      this.currentRender.destroy();
    }
    this.currentRender = render;
    this.currentRender.draw(...this.objects);
  }

  registerRender(render: Render) {
    this.renders.set(render.name, render);
  }

  getRender(renderName: string): Render {
    return this.renders.get(renderName) as Render;
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
    this.draw();
  }

  add(r: Shape): void {
    this.objects.push(r);
    this.objId++;
  }

  do<T>(a: Action<T>): T {
    if ((a as UndoableAction<T>).undo !== undefined) {
      this.undoManager.onActionDone(a as UndoableAction<T>);

      //sync manager
      this.syncManager.actions.push(a as UndoableAction<T>);
      this.syncManager.publish(this.syncManager.syncExistentClients());
    }
    return a.do();
  }

  changeRender(renderName: string): Render {
    return this.do(new ChangeRenderAction(this, renderName));
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

  createPolygon(points: Coordinate[]) {
    return this.do(new CreatePolygonAction(this, this.objId++, points));
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

  export(action: string) {
    const context = new Context();

    if (action === 'XML') {
      context.setStrategy(new ConcreteStrategyXMLExp());
    }
    if (action === 'JSON') {
      context.setStrategy(new ConcreteStrategyJSONExp());
    }

    const result = context.executeStrategy(this.objects);
  }

  import(action: string) {
    const context = new Context();

    //const read = require('file-reader');

    if (action === 'XML') {
      //const read = require('fs').readFileSync('newXmlDoc.xml', 'utf8');
      context.setStrategy(new ConcreteStrategyXMLImp('test' /*read*/));
    }
    if (action === 'JSON') {
      context.setStrategy(new ConcreteStrategyJSONImp('test'));
    }

    const result = context.executeStrategy(this.objects);
  }

  getShapeById(id: number): Shape {
    return this.objects.find(shape => shape.getId() === id) as Shape;
  }
}
