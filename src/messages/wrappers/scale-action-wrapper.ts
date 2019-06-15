import { SimpleDrawDocument } from "document";
import { ScaleMultiuserMessage } from 'messages/scale-multiuser-message';
import { ScaleAction } from "actions/scale-action";

export class ScaleActionWrapper {
    constructor(private doc: SimpleDrawDocument, private message: string) {
      const msg = new ScaleMultiuserMessage(this.message);
      const action = new ScaleAction(
        this.doc,
        this.doc.getShapeById(msg.objectID),
        msg.scaleX,
        msg.scaleY
      );
      action.setOldScaling(msg.oldScaleX, msg.oldScaleY);

      if (msg.isToDo()) {
        action.do();
        this.doc.undoManager.syncManager.doAction(action);
      } else {
        action.undo();
        this.doc.undoManager.syncManager.undoAction(action);
      }
    }


}