import { MultiuserMessage } from './multiuser-message';
import { Coordinate } from 'utilities/coordinate';

export class CreatePolygonMultiuserMessage implements MultiuserMessage {
    objectID: number;
    polygonPoints: Coordinate[] = [];
    doOrUndo: string;

    constructor(protected message: string) {
        const parsedMessage = JSON.parse(this.message);

        this.objectID = parsedMessage.objectID;
        
        // tslint:disable-next-line:ban-ts-ignore
        // @ts-ignore
        parsedMessage.points.forEach(element => {
            // tslint:disable-line
            this.polygonPoints.push(new Coordinate(element.x, element.y));
        });
        this.doOrUndo = parsedMessage.doOrUndo;
    }

    isToDo() {
        return this.doOrUndo === 'do';
    }
}