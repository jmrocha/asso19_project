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
    this.shape.coordinates.forEach(element => {
      this.oldCoordinates.push(new Coordinate(element.x, element.y));
    });

    this.shape.coordinates.forEach(element => {
      element.x += this.xd;
      element.y += this.yd;
    });
  }

  undo() {
    this.shape.coordinates = [...this.oldCoordinates];
  }

  toJSON(): string {
    return JSON.stringify({ type: 'TranslateAction', shape: JSON.stringify(this.shape), xd: this.xd, yd: this.yd });
  }
}
