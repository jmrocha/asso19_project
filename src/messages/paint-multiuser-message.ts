import { MultiuserMessage } from './multiuser-message';

export class PaintMultiuserMessage implements MultiuserMessage {
    objectID: number;
    oldFillColor: string;
    fillColor: string;
    doOrUndo: string;

    constructor(protected message: string) {
        const parsedMessage = JSON.parse(this.message);

        this.objectID = parsedMessage.objectID;
        this.oldFillColor = parsedMessage.oldFillColor;
        this.fillColor = parsedMessage.fillColor;
        this.doOrUndo = parsedMessage.doOrUndo;

    }

    isToDo() {
        return this.doOrUndo === 'do';
    }
}