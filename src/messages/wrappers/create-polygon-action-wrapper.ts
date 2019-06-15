import { SimpleDrawDocument } from "document";
import { CreatePolygonMultiuserMessage } from 'messages/create-polygon-multiuser-message';
import { CreatePolygonAction } from "actions/create-polygon-action";

export class CreatePolygonActionWrapper {
    constructor(private doc: SimpleDrawDocument, private message: string) {
      const msg = new CreatePolygonMultiuserMessage(this.message);
      const action = new CreatePolygonAction(
        this.doc,
        msg.objectID,
        msg.polygonPoints
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