import { MultiuserMessage } from './multiuser-message';

export class CreateTriangleMultiuserMessage implements MultiuserMessage {
    objectID: number;
    p1X: number;
    p1Y: number;
    p2X: number;
    p2Y: number;
    p3X: number;
    p3Y: number;
    doOrUndo: string;

    constructor(protected message: string) {
        const parsedMessage = JSON.parse(this.message);

        this.objectID = parsedMessage.objectID;
        this.p1X = parsedMessage.p1X;
        this.p1Y = parsedMessage.p1Y;
        this.p2X = parsedMessage.p2X;
        this.p2Y = parsedMessage.p2Y;
        this.p3X = parsedMessage.p3X;
        this.p3Y = parsedMessage.p3Y;
        this.doOrUndo = parsedMessage.doOrUndo;
    }

    isToDo() {
        return this.doOrUndo === 'do';
    }
}