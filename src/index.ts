import { SimpleDrawDocument } from './document';
import { SVGRender } from './render/svg-render';
import { SVGInvertedRender } from './render/svg-inverted-render';
import { CanvasInvertedRender } from 'render/canvas-inverted-render';
import { CanvasRender } from 'render/canvas-render';
import { connect } from 'mqtt';
import { CreateRectangleActionWrapper } from 'messages/wrappers/create-rectangle-action-wrapper';
import { CreateCircleActionWrapper } from 'messages/wrappers/create-circle-action-wrapper';
import { CreateTriangleActionWrapper } from 'messages/wrappers/create-triangle-action-wrapper';
import { CreatePolygonActionWrapper } from 'messages/wrappers/create-polygon-action-wrapper';
import { TranslateActionWrapper } from 'messages/wrappers/translate-action-wrapper';
import { RotateActionWrapper } from 'messages/wrappers/rotate-action-wrapper';
import { ScaleActionWrapper } from 'messages/wrappers/scale-action-wrapper';
import { PaintActionWrapper } from 'messages/wrappers/paint-action-wrapper';
import { Controls } from './controls';

const docID = Date.now() + Math.random();
const client = connect(
  'wss://iot.eclipse.org:443/ws',
  {
    clientId: docID.toString(),
    clean: false,
  }
);

const canvas = document.getElementById('canvas') as HTMLElement;
export const defaultRender = new SVGRender('svg', canvas);
const svgInvertedRender = new SVGInvertedRender('svg-inverted', canvas);
const canvasRender = new CanvasRender('canvas', canvas);
const canvasInvertedRender = new CanvasInvertedRender('canvas-inverted', canvas);
export const simpleDrawDocument = new SimpleDrawDocument(
  docID,
  client,
  defaultRender
);
const controls = new Controls(simpleDrawDocument, defaultRender);

simpleDrawDocument.registerRender(canvasRender);
simpleDrawDocument.registerRender(canvasInvertedRender);
simpleDrawDocument.registerRender(svgInvertedRender);

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
        action = new CreateRectangleActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'CreateCircleAction':
        action = new CreateCircleActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'CreateTriangleAction':
        action = new CreateTriangleActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'CreatePolygonAction':
        action = new CreatePolygonActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'TranslateAction':
        action = new TranslateActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'RotateAction':
        action = new RotateActionWrapper(
          simpleDrawDocument,
          message.toString()
        );
        break;
      case 'ScaleAction':
        action = new ScaleActionWrapper(simpleDrawDocument, message.toString());
        break;
      case 'PaintAction':
        action = new PaintActionWrapper(simpleDrawDocument, message.toString());
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

client.on('message', (topic, message) => {
  if (topic === 'ASSOSimpleDraw') {
    if (isJson(message.toString())) {
    } else {
      console.log(message.toString());
    }
  } else if (topic === 'ASSOSimpleDrawSync') {
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
