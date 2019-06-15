import { SimpleDrawDocument } from 'document';
import { CreateRectangleMultiuserMessage } from 'messages/create-rectangle-multiuser-message';
import { CreateRectangleAction } from 'actions/create-rectangle-action';

export class CreateRectangleActionWrapper {
  constructor(private doc: SimpleDrawDocument, private message: string) {
    const msg = new CreateRectangleMultiuserMessage(this.message);
    const action = new CreateRectangleAction(
      this.doc,
      msg.objectID,
      msg.x,
      msg.y,
      msg.width,
      msg.height
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
