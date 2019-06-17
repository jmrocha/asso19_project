import { MultiuserMessage } from './multiuser-message';

export class CreateRectangleMultiuserMessage implements MultiuserMessage {
  objectID: number;
  x: number;
  y: number;
  width: number;
  height: number;
  doOrUndo: string;

  constructor(protected message: string) {
    const parsedMessage = JSON.parse(this.message);

    this.objectID = parsedMessage.objectID;
    this.x = parsedMessage.x;
    this.y = parsedMessage.y;
    this.width = parsedMessage.width;
    this.height = parsedMessage.height;
    this.doOrUndo = parsedMessage.doOrUndo;
  }

  isToDo() {
    return this.doOrUndo === 'do';
  }
}
