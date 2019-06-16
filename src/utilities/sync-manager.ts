import { MqttClient } from 'mqtt';
import { UndoableAction } from 'actions/undoable-action';

export class SyncManager {
  actions = new Array<UndoableAction<any>>(); // tslint:disable-line

  constructor(public client: MqttClient, private docID: number) {}

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

    this.actions.forEach(element => {
      json.actions.push(JSON.parse(element.toJSON(this.docID)));
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

    this.actions.forEach(element => {
      json.actions.push(JSON.parse(element.toJSON(this.docID)));
    });

    return JSON.stringify(json);
  }
}
