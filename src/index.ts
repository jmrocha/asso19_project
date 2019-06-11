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

const simpleDrawDocument = new SimpleDrawDocument();
const e = document.getElementById('terminal') as HTMLInputElement;
const d = document.getElementById('exportFormXML') as HTMLElement;
const j = document.getElementById('exportFormJSON') as HTMLElement;
const t = new Terminal(e);
const promptTextElem = t.getPromptTextElem();
const canvas = document.getElementById('canvas') as HTMLElement;
const defaultRender = new SVGRender(canvas);

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

d.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  console.log('Exported XML');
  simpleDrawDocument.export('XML');
});

j.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  console.log('Exported JSON');
  simpleDrawDocument.export('JSON');
});

const c = new Circle(200, 200, 50);
const c1 = new Circle(200, 200, 50);
const r = new Rectangle(400, 400, 50, 50);
const t1 = new Triangle(
  new Coordinate(100, 100),
  new Coordinate(200, 200),
  new Coordinate(100, 200)
);
const p1 = new Polygon(
  new Coordinate(400, 400),
  new Coordinate(500, 500),
  new Coordinate(400, 500),
  new Coordinate(300, 400)
);

simpleDrawDocument.add(r);
simpleDrawDocument.add(c);
simpleDrawDocument.add(c1);
simpleDrawDocument.add(t1);
simpleDrawDocument.add(p1);
simpleDrawDocument.translate(c1, 300, 0);
simpleDrawDocument.scale(r, 1.5, 1.5);
simpleDrawDocument.paint(r, 'red');
simpleDrawDocument.draw(defaultRender);

simpleDrawDocument.import('XML');
simpleDrawDocument.import('JSON');
