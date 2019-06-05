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
    this.oldCoordinates = this.shape.coordinates;
    console.log('before: ' + this.shape);
    this.shape.translate(this.xd, this.yd);
    console.log('after: ' + this.shape);
    //this.doc.translate(this.shape, this.xd, this.yd);
  }

  undo() {
    this.shape.coordinates = this.oldCoordinates;
  }
}
