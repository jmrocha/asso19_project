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
    if ((a as UndoableAction<T>).undo !== undefined) {
      this.undoManager.onActionDone(a as UndoableAction<T>);
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
      //read.file('newXmlDoc.xml');
      //console.log(read);
      //console.log('\n\n\n');
      context.setStrategy(new ConcreteStrategyXMLImp('test' /*read*/));
    }
    if (action === 'JSON') {
      context.setStrategy(new ConcreteStrategyJSONImp('test'));
    }

    const result = context.executeStrategy(this.objects);
  }
}
