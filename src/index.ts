import { SimpleDrawDocument } from './document';
import { Terminal } from './terminal';
import { ExprAbstractExpr } from './repl/expr-abstract-expr';
import { SVGRender } from './render/svg-render';
import { Circle } from 'shapes/circle';

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


const circle = new Circle(100, 100, 15);
const circle2 = new Circle(150, 100, 15);
simpleDrawDocument.add(circle);
simpleDrawDocument.add(circle2);
console.log(circle2);
simpleDrawDocument.translate(circle2, 500, 500);
console.log(circle2);
simpleDrawDocument.draw(defaultRender);