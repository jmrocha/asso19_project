import { SimpleDrawDocument } from 'document';
import { PaintMultiuserMessage } from 'messages/paint-multiuser-message';
import { PaintAction } from 'actions/paint-action';

export class PaintActionWrapper {
  constructor(private doc: SimpleDrawDocument, private message: string) {
    const msg = new PaintMultiuserMessage(this.message);
    const action = new PaintAction(
      this.doc,
      this.doc.getShapeById(msg.objectID),
      msg.fillColor
    );
    action.setOldFillColor(msg.oldFillColor);

    if (msg.isToDo()) {
      action.do();
      this.doc.undoManager.syncManager.doAction(action);
    } else {
      action.undo();
      this.doc.undoManager.syncManager.undoAction(action);
    }
  }
}
