import { SimpleDrawDocument } from '../document';
import { Shape } from '../shapes/shape';
import { Action } from './action';
import { Coordinate } from '../utilities/coordinate';

export class TranslateAction implements Action<void> {
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
    this.shape.translate(this.xd, this.yd);
  }

  undo() {
    this.shape.coordinates = [...this.oldCoordinates];
  }
}
