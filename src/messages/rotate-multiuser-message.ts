import { MultiuserMessage } from './multiuser-message';

export class RotateMultiuserMessage implements MultiuserMessage {
  objectID: number;
  oldRotation: number;
  rotation: number;
  doOrUndo: string;

  constructor(protected message: string) {
    const parsedMessage = JSON.parse(this.message);

    this.objectID = parsedMessage.objectID;
    this.oldRotation = parsedMessage.oldRotation;
    this.rotation = parsedMessage.rotation;
    this.doOrUndo = parsedMessage.doOrUndo;
  }

  isToDo() {
    return this.doOrUndo === 'do';
  }
}
