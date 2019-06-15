import { MqttClient } from 'mqtt';
import { UndoableAction } from 'actions/undoable-action';

export class SyncManager {
  actions = new Array<UndoableAction<any>>(); // tslint:disable-line
  actionsDo = new Array<boolean>(); //aux array to 'actions' to know if an action is to be done or undone

  constructor(public client: MqttClient, private docID: number) {}

  doAction(action: UndoableAction<any>) { // tslint:disable-line
    this.actions.push(action);
    this.actionsDo.push(true);
  }

  undoAction(action: UndoableAction<any>) { // tslint:disable-line
    this.actions.push(action);
    this.actionsDo.push(false);
  }

  publish(object: string): void {
    this.client.publish('ASSOSimpleDrawSync', object, {
      qos: 1,
    });
  }

  syncNewClient(newClientID: number): string {
    const jsonString =
      '{ "docID": "' +
      this.docID +
      '", "newClientID": "' +
      newClientID +
      '", "type": "SYNC_NEW_CLIENT", "actions": [] ' +
      '}';
    const json = JSON.parse(jsonString);

    this.actions.forEach((element, index) => {
      json.actions.push(
        JSON.parse(element.toJSON(this.docID, this.actionsDo[index]))
      );
    });

    return JSON.stringify(json);
  }

  syncExistentClients(): string {
    const jsonString =
      '{ "docID": "' +
      this.docID +
      '", "type": "SYNC_MESSAGE", "actions": [] ' +
      '}';
    const json = JSON.parse(jsonString);

    this.actions.forEach((element, index) => {
      json.actions.push(
        JSON.parse(element.toJSON(this.docID, this.actionsDo[index]))
      );
    });

    return JSON.stringify(json);
  }
}
