import { AbstractExpr } from './abstract-expr';
import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export class RenderAbstractExpr extends AbstractExpr {
  constructor(simpleDrawDocument: SimpleDrawDocument, render: Render) {
    super(simpleDrawDocument, render);
  }

  evaluate(input: string): string {
    const renderName = input
      .split('render')[1]
      .trim()
      .toLowerCase();

    const render = this.simpleDrawDocument.getRender(renderName);
    if (!render) {
      throw new Error("render: render doesn't exist");
    }
    this.simpleDrawDocument.setCurrentRender(render);

    return '';
  }
}
