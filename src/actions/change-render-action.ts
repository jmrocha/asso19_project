import { SimpleDrawDocument } from '../document';
import { Action } from './action';
import { Render } from '../render/render';

export class ChangeRenderAction implements Action<Render> {
  constructor(private doc: SimpleDrawDocument, private renderName: string) {}

  do(): Render {
    const render = this.doc.getRender(this.renderName);
    if (!render) {
      throw new Error("render: render doesn't exist");
    }
    this.doc.setCurrentRender(render);
    return render;
  }
}
