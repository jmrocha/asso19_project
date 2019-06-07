import { SimpleDrawDocument } from './document';
import { Terminal } from './terminal';
import { ExprAbstractExpr } from './repl/expr-abstract-expr';
import { SVGRender } from './render/svg-render';
import { Coordinate } from 'utilities/coordinate';
import { Circle } from 'shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';
import { CanvasRender } from 'render/canvas-render';
import { Rectangle } from 'shapes/rectangle';

const canvas = document.getElementById('canvas') as HTMLElement;
const defaultRender = new SVGRender(canvas);
const simpleDrawDocument = new SimpleDrawDocument(defaultRender);
const e = document.getElementById('terminal') as HTMLInputElement;
const t = new Terminal(e);
const promptTextElem = t.getPromptTextElem();

e.addEventListener('keydown', event => {
  if (event.code === 'Enter') {
    const expr = promptTextElem.value;
    t.print(expr);
    try {
      const res = new ExprAbstractExpr(
        simpleDrawDocument,
        defaultRender
      ).evaluate(expr);
      t.printSuccess(res);
    } catch (error) {
      t.printError(error.message);
    }
  }
});

simpleDrawDocument.createRectangle(10, 10, 10, 10);
simpleDrawDocument.draw();
simpleDrawDocument.createRectangle(20, 20, 10, 10);
simpleDrawDocument.draw();
simpleDrawDocument.createRectangle(30, 30, 10, 10);
simpleDrawDocument.draw();
//simpleDrawDocument.translate(c1, 300, 0);
//simpleDrawDocument.scale(r, 1.5, 1.5);
//simpleDrawDocument.paint(r, 'red');
