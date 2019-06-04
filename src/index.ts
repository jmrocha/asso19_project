import { SimpleDrawDocument } from './document';
import { SVGRender } from './render';
import { Terminal } from './terminal';
import { ExprAbstractExpr } from './repl/expr-abstract-expr';

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
