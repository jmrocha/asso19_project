import { SimpleDrawDocument } from 'document';
import { CreateTriangleMultiuserMessage } from 'messages/create-triangle-multiuser-message';
import { CreateTriangleAction } from 'actions/create-triangle-action';
import { Coordinate } from 'utilities/coordinate';

export class CreateTriangleActionWrapper {
  constructor(private doc: SimpleDrawDocument, private message: string) {
    const msg = new CreateTriangleMultiuserMessage(this.message);
    const action = new CreateTriangleAction(
      this.doc,
      msg.objectID,
      new Coordinate(msg.p1X, msg.p1Y),
      new Coordinate(msg.p2X, msg.p2Y),
      new Coordinate(msg.p3X, msg.p3Y)
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
