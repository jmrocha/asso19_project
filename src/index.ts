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
import { connect } from 'mqtt';
import { CreateRectangleAction } from 'actions/create-rectangle-action';

const client = connect('ws://iot.eclipse.org:80/ws');

const simpleDrawDocument = new SimpleDrawDocument(client);
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

function isJson(item: string) {
  item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }

  if (typeof item === "object" && item !== null) {
      return true;
  }

  return false;
}

client.on('message', (topic, message) => {
  if(isJson(message.toString())) {
    const parsedMessage = JSON.parse(message.toString());

    switch(parsedMessage.type) {
      case 'CreateRectangleAction':
        const rect = new Rectangle(parsedMessage.x, parsedMessage.y, parsedMessage.width, parsedMessage.height);
        simpleDrawDocument.add(rect);
        break;
      default:
        break;
    }
    simpleDrawDocument.draw(defaultRender);
  } else {
    console.log(message.toString());
  }
});

simpleDrawDocument.draw(defaultRender);
