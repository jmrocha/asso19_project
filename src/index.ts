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
import { CreateCircleAction } from 'actions/create-circle-action';
import { CreateTriangleAction } from 'actions/create-triangle-action';
import { CreatePolygonAction } from 'actions/create-polygon-action';

const docID = Date.now() + Math.random();
const client = connect(
  'ws://iot.eclipse.org:80/ws',
  {
    clientId: docID.toString(),
    clean: false,
  }
);

const canvas = document.getElementById('canvas') as HTMLElement;
const defaultRender = new SVGRender('svg', canvas);
const canvasRender = new CanvasRender('canvas', canvas);
const simpleDrawDocument = new SimpleDrawDocument(docID, client, defaultRender);
const e = document.getElementById('terminal') as HTMLInputElement;
const t = new Terminal(e);
const promptTextElem = t.getPromptTextElem();

simpleDrawDocument.registerRender(canvasRender);

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
  let action;

  if (docID !== parsedMessage.docID) {
    switch (parsedMessage.type) {
      case 'CreateRectangleAction':
        action = new CreateRectangleAction(
          simpleDrawDocument,
          parsedMessage.objectID,
          parsedMessage.x,
          parsedMessage.y,
          parsedMessage.width,
          parsedMessage.height
        );
        if(parsedMessage.doOrUndo === 'do'){
          action.do();
          simpleDrawDocument.undoManager.syncManager.doAction(action);  
        } else {
          action.undo();
          simpleDrawDocument.undoManager.syncManager.undoAction(action);
        }
        break;
      case 'CreateCircleAction':
        action = new CreateCircleAction(
          simpleDrawDocument,
          parsedMessage.objectID,
          parsedMessage.x,
          parsedMessage.y,
          parsedMessage.radius
        );
        if(parsedMessage.doOrUndo === 'do'){
          action.do();
          simpleDrawDocument.undoManager.syncManager.doAction(action);
        } else {
          action.undo();
          simpleDrawDocument.undoManager.syncManager.undoAction(action);
        }
        break;
      case 'CreateTriangleAction':
        action = new CreateTriangleAction(
          simpleDrawDocument,
          parsedMessage.objectID,
          new Coordinate(parsedMessage.p1X, parsedMessage.p1Y),
          new Coordinate(parsedMessage.p2X, parsedMessage.p2Y),
          new Coordinate(parsedMessage.p3X, parsedMessage.p3Y)
        );
        if(parsedMessage.doOrUndo === 'do'){
          action.do();
          simpleDrawDocument.undoManager.syncManager.doAction(action);
        } else {
          action.undo();
          simpleDrawDocument.undoManager.syncManager.undoAction(action);
        }
        break;
      case 'CreatePolygonAction':
        const polygonPoints: Coordinate[] = [];
        // tslint:disable-next-line:ban-ts-ignore
        // @ts-ignore
        parsedMessage.points.forEach((element) => { 
          // tslint:disable-line
          polygonPoints.push(new Coordinate(element.x, element.y));
        });

        action = new CreatePolygonAction(
          simpleDrawDocument,
          parsedMessage.objectID,
          polygonPoints
        );

        if(parsedMessage.doOrUndo === 'do'){
          action.do();
          simpleDrawDocument.undoManager.syncManager.doAction(action);
        } else {
          action.undo();
          simpleDrawDocument.undoManager.syncManager.undoAction(action);
        }
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
    console.log(JSON.parse(message.toString()));
    if (JSON.parse(message.toString()).docID !== docID) {
      if (JSON.parse(message.toString()).type === 'SYNC_REQUEST') {
        simpleDrawDocument.undoManager.syncManager.publish(
          simpleDrawDocument.undoManager.syncManager.syncNewClient(
            JSON.parse(message.toString()).docID
          )
        );
      } else if (JSON.parse(message.toString()).type === 'SYNC_NEW_CLIENT') {
        if (JSON.parse(message.toString()).newClientID === docID.toString()) {
          //wtf
          if (simpleDrawDocument.undoManager.syncManager.actions.length === 0) {
            const actions = JSON.parse(message.toString()).actions;
            // tslint:disable-next-line:ban-ts-ignore
            // @ts-ignore
            actions.forEach((element) => {
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

// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
document.getElementById('import-link').onclick = () => {
  // tslint:disable-next-line:ban-ts-ignore
  // @ts-ignore
  document.getElementById('file-upload').click();
};
