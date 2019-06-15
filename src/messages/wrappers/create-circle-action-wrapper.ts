import { SimpleDrawDocument } from "document";
import { CreateCircleMultiuserMessage } from "messages/create-circle-multiuser-message";
import { CreateCircleAction } from "actions/create-circle-action";

export class CreateCircleActionWrapper {
    constructor(private doc: SimpleDrawDocument, private message: string) {
      const msg = new CreateCircleMultiuserMessage(this.message);
        const action = new CreateCircleAction(
          this.doc,
          msg.objectID,
          msg.x,
          msg.y,
          msg.radius
        );
        if (msg.isToDo()) {
          action.do();
          this.doc.undoManager.syncManager.doAction(action);
        } else {
          action.undo();
          this.doc.undoManager.syncManager.undoAction(action);
        }
    }


}