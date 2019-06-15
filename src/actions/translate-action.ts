import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { UndoableAction } from './undoable-action';
import { Coordinate } from '../utilities/coordinate';

export class TranslateAction implements UndoableAction<void> {
  oldCoordinates: Coordinate[] = [];

  constructor(
    private doc: SimpleDrawDocument,
    public shape: Shape,
    private xd: number,
    private yd: number
  ) {}

  do(): void {
    this.oldCoordinates = [];
    this.shape.coordinates.forEach(element => {
      this.oldCoordinates.push(new Coordinate(element.x, element.y));
    });

    this.shape.coordinates.forEach(element => {
      element.x += this.xd;
      element.y += this.yd;
    });

    console.log(this.oldCoordinates);
  }

  undo() {
    this.shape.coordinates = [...this.oldCoordinates];
  }

  setOldCoordinates(oldCoordinates: Coordinate[]): void {
    this.oldCoordinates = oldCoordinates;
  }

  toJSON(docID: number, toDo: boolean): string {
    const pointsString = '[]';
    const points = JSON.parse(pointsString);

    this.oldCoordinates.forEach(element => {
      points.push({ x: element.x, y: element.y });
    });

    return JSON.stringify({
      docID,
      type: 'TranslateAction',
      doOrUndo: toDo ? 'do' : 'undo',
      objectID: this.shape.getId(),
      xd: this.xd,
      yd: this.yd,
      oldCoordinates: points,
    });
  }
}
