import { SimpleDrawDocument } from './document';
import { Terminal } from './terminal';
import { ExprAbstractExpr } from './repl/expr-abstract-expr';
import { SVGRender } from './render/svg-render';
import { SVGInvertedRender } from './render/svg-inverted-render';
import { Coordinate } from 'utilities/coordinate';
import { Circle } from 'shapes/circle';
import { Triangle } from 'shapes/triangle';
import { Polygon } from 'shapes/polygon';
import { CanvasRender } from 'render/canvas-render';
import { Rectangle } from 'shapes/rectangle';
import { connect } from 'mqtt';
import { CreateRectangleAction } from 'actions/create-rectangle-action';
import { UndoableAction } from 'actions/undoable-action';
import { Controls } from './controls';
import { CanvasInvertedRender } from 'render/canvas-inverted-render';

const docID = Date.now() + Math.random();
const client = connect(
  'wss://iot.eclipse.org:443/ws',
  {
    clientId: docID.toString(),
    clean: false,
  }
);

const canvas = document.getElementById('canvas') as HTMLElement;
export const defaultRender = new SVGInvertedRender('svg', canvas);
//const canvasRender = new CanvasRender('canvas', canvas);
const canvasRender = new CanvasInvertedRender('canvas', canvas);
export const simpleDrawDocument = new SimpleDrawDocument(
  docID,
  client,
  defaultRender
);
const controls = new Controls(simpleDrawDocument, defaultRender);

simpleDrawDocument.registerRender(canvasRender);
//simpleDrawDocument.registerRender(canvasInvertedRender);

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
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            actions.forEach(element => {
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
