import { MultiuserMessage } from './multiuser-message';

export class CreateCircleMultiuserMessage implements MultiuserMessage {
  objectID: number;
  x: number;
  y: number;
  radius: number;
  doOrUndo: string;

  constructor(protected message: string) {
    const parsedMessage = JSON.parse(this.message);

    this.objectID = parsedMessage.objectID;
    this.x = parsedMessage.x;
    this.y = parsedMessage.y;
    this.radius = parsedMessage.radius;
    this.doOrUndo = parsedMessage.doOrUndo;
  }

  isToDo() {
    return this.doOrUndo === 'do';
  }
}
