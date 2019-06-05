import { SimpleDrawDocument } from './document';
import { Terminal } from './terminal';
import { ExprAbstractExpr } from './repl/expr-abstract-expr';
import { SVGRender } from './render/svg-render';
import { Coordinate } from 'utilities/coordinate';
import { Circle } from 'shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';

const simpleDrawDocument = new SimpleDrawDocument();
const e = document.getElementById('terminal') as HTMLInputElement;
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

const terminalElem = document.getElementById('terminal');
if (terminalElem) {
  terminalElem.onclick = () => {
    t.focus();
  };
}

const c = new Circle(100, 100, 40);
const tri = new Triangle(new Coordinate(100, 100), new Coordinate(100, 200), new Coordinate(300, 300));
const p = new Polygon(new Coordinate(100, 100), new Coordinate(354, 213), new Coordinate(289, 275), new Coordinate(157, 198));
simpleDrawDocument.add(c);
simpleDrawDocument.add(tri);
simpleDrawDocument.add(p);
simpleDrawDocument.translate(p, 300, 300);
simpleDrawDocument.undo();
simpleDrawDocument.redo();
simpleDrawDocument.draw(defaultRender);