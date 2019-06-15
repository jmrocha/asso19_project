import { SimpleDrawDocument } from 'document';
import { TranslateMultiuserMessage } from 'messages/translate-multiuser-message';
import { TranslateAction } from 'actions/translate-action';

export class TranslateActionWrapper {
  constructor(private doc: SimpleDrawDocument, private message: string) {
    const msg = new TranslateMultiuserMessage(this.message);
    const action = new TranslateAction(
      this.doc,
      this.doc.getShapeById(msg.objectID),
      msg.xd,
      msg.yd
    );
    action.setOldCoordinates(msg.oldCoordinates);

    if (msg.isToDo()) {
      action.do();
      this.doc.undoManager.syncManager.doAction(action);
    } else {
      action.undo();
      this.doc.undoManager.syncManager.undoAction(action);
    }
  }
}
