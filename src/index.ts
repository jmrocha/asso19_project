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
import { UndoableAction } from 'actions/undoable-action';

const docID = Date.now() + Math.random();
const client = connect(
  'ws://iot.eclipse.org:80/ws',
  {
    clientId: docID.toString(),
    clean: false,
  }
);

const canvas = document.getElementById('canvas') as HTMLElement;
const defaultRender = new SVGRender(canvas);
const simpleDrawDocument = new SimpleDrawDocument(docID, client, defaultRender);
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

function isJson(item: string) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
}

function messageHandler(message: string) {
  const parsedMessage = JSON.parse(message.toString());

  if (docID !== parsedMessage.docID) {
    switch (parsedMessage.type) {
      case 'CreateRectangleAction':
        const rect = new Rectangle(
          simpleDrawDocument.objId,
          parsedMessage.x,
          parsedMessage.y,
          parsedMessage.width,
          parsedMessage.height
        );
        simpleDrawDocument.add(rect);
        simpleDrawDocument.syncManager.actions.push(
          new CreateRectangleAction(
            simpleDrawDocument,
            parsedMessage.objectID,
            parsedMessage.x,
            parsedMessage.y,
            parsedMessage.width,
            parsedMessage.height
          )
        );
        break;
      case 'CreateCircleAction':
        const circle = new Circle(
          parsedMessage.objectID,
          parsedMessage.x,
          parsedMessage.y,
          parsedMessage.radius
        );
        simpleDrawDocument.add(circle);
        break;
      case 'CreateTriangleAction':
        //console.log(parsedMessage.p1);
        //const triangle = new Triangle(parsedMessage.objectID, new Coordinate)
        //simpleDrawDocument.add(triangle);
        break;
      case 'CreatePolygonAction':
        //simpleDrawDocument.add(triangle);
        break;
      case 'TranslateAction':
        break;
      case 'RotateAction':
        break;
      case 'ScaleAction':
        break;
      case 'PaintAction':
        break;
      default:
        break;
    }
  }
}

client.on('message', (topic, message) => {
  if (topic === 'ASSOSimpleDraw') {
    if (isJson(message.toString())) {
    } else {
      console.log(message.toString());
    }
  } else if (topic === 'ASSOSimpleDrawSync') {
    if (JSON.parse(message.toString()).docID !== docID) {
      if (JSON.parse(message.toString()).type === 'SYNC_REQUEST') {
        simpleDrawDocument.syncManager.publish(
          simpleDrawDocument.syncManager.syncNewClient(
            JSON.parse(message.toString()).docID
          )
        );
      } else if (JSON.parse(message.toString()).type === 'SYNC_NEW_CLIENT') {
        if (JSON.parse(message.toString()).newClientID === docID.toString()) {
          //wtf
          if (simpleDrawDocument.syncManager.actions.length === 0) {
            const actions = JSON.parse(message.toString()).actions;
            actions.forEach((element: any) => {
              // tslint:disable-line
              messageHandler(JSON.stringify(element));
            });
            simpleDrawDocument.draw();
          }
        }
      } else if (JSON.parse(message.toString()).type === 'SYNC_MESSAGE') {
        const actions = JSON.parse(message.toString()).actions;
        messageHandler(JSON.stringify(actions[actions.length - 1]));
        simpleDrawDocument.draw();
      }
    }
  }
});
