import { MultiuserMessage } from './multiuser-message';
import { Coordinate } from 'utilities/coordinate';

export class TranslateMultiuserMessage implements MultiuserMessage {
    objectID: number;
    oldCoordinates: Coordinate[] = [];
    xd: number;
    yd: number;
    doOrUndo: string;

    constructor(protected message: string) {
        const parsedMessage = JSON.parse(this.message);

        this.objectID = parsedMessage.objectID;
        this.xd = parsedMessage.xd;
        this.yd = parsedMessage.yd;
        
        // tslint:disable-next-line:ban-ts-ignore
        // @ts-ignore
        parsedMessage.oldCoordinates.forEach(element => {
            // tslint:disable-line
            this.oldCoordinates.push(new Coordinate(element.x, element.y));
        });
        this.doOrUndo = parsedMessage.doOrUndo;

    }

    isToDo() {
        return this.doOrUndo === 'do';
    }
}