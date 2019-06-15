import { SimpleDrawDocument } from "document";
import { RotateMultiuserMessage } from 'messages/rotate-multiuser-message';
import { RotateAction } from "actions/rotate-action";

export class RotateActionWrapper {
    constructor(private doc: SimpleDrawDocument, private message: string) {
      const msg = new RotateMultiuserMessage(this.message);
      const action = new RotateAction(
        this.doc,
        this.doc.getShapeById(msg.objectID),
        msg.rotation
      );
      action.setOldRotation(msg.oldRotation);

      if (msg.isToDo()) {
        action.do();
        this.doc.undoManager.syncManager.doAction(action);
      } else {
        action.undo();
        this.doc.undoManager.syncManager.undoAction(action);
      }
    }


}