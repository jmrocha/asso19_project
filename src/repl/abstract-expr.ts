import { SimpleDrawDocument } from '../document';
import { Render } from '../render';

export abstract class AbstractExpr {
  protected constructor(
    protected simpleDrawDocument: SimpleDrawDocument,
    protected render: Render
  ) {}

  abstract evaluate(input: string): string;

  setRender(render: Render): void {
    this.render = render;
  }
}
