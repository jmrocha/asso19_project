import { MultiuserMessage } from './multiuser-message';

export class ScaleMultiuserMessage implements MultiuserMessage {
  objectID: number;
  oldScaleX: number;
  oldScaleY: number;
  scaleX: number;
  scaleY: number;
  doOrUndo: string;

  constructor(protected message: string) {
    const parsedMessage = JSON.parse(this.message);

    this.objectID = parsedMessage.objectID;
    this.oldScaleX = parsedMessage.oldScaleX;
    this.oldScaleY = parsedMessage.oldScaleY;
    this.scaleX = parsedMessage.scaleX;
    this.scaleY = parsedMessage.scaleY;
    this.doOrUndo = parsedMessage.doOrUndo;
  }

  isToDo() {
    return this.doOrUndo === 'do';
  }
}
