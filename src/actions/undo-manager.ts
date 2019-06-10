import { Action } from './action';
import { UndoableAction } from './undoable-action';
import { SimpleDrawDocument } from 'document';
import { SyncManager } from '../utilities/sync-manager';

export class UndoManager<S, A extends UndoableAction<S>> {
  doStack = new Array<A>();
  undoStack = new Array<A>();
  syncManager: SyncManager = new SyncManager(this.doc.client, this.doc.docID);

  constructor(public doc: SimpleDrawDocument){

  }

  undo() {
    if (this.doStack.length > 0) {
      const a1 = this.doStack.pop();
      if (a1) {
        a1.undo();
        this.undoStack.push(a1);
        
        //sync manager
        this.syncManager.undoAction(a1);
        this.syncManager.publish(this.syncManager.syncExistentClients());
      }
    }
  }

  redo() {
    if (this.undoStack.length > 0) {
      const a1 = this.undoStack.pop();
      if (a1) {
        a1.do();
        this.doStack.push(a1);
        
        //sync manager
        this.syncManager.doAction(a1);
        this.syncManager.publish(this.syncManager.syncExistentClients());
      }
    }
  }

  onActionDone(a: A): void {
    this.doStack.push(a);
    this.undoStack.length = 0;
    
    //sync manager
    this.syncManager.doAction(a);
    this.syncManager.publish(this.syncManager.syncExistentClients());
  }
}
