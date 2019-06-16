import { SimpleDrawDocument } from '../document';
import { Render } from '../render/render';

export abstract class AbstractExpr {
  protected constructor(
    protected simpleDrawDocument: SimpleDrawDocument,
    protected render: Render
  ) {}

  abstract evaluate(input: string): string;
}
