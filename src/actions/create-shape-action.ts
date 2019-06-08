import { Shape } from '../shapes/shape';
import { SimpleDrawDocument } from '../document';
import { UndoableAction } from './undoable-action';

export abstract class CreateShapeAction<S extends Shape>
  implements UndoableAction<S> {
  protected constructor(private doc: SimpleDrawDocument, readonly shape: S) {}

  do(): S {
    this.doc.add(this.shape);
    return this.shape;
  }

  undo() {
    this.doc.objects = this.doc.objects.filter(o => o !== this.shape);
  }

  toJSON() {
    return '';
  }
}
