import { ExprAbstractExpr } from './repl/expr-abstract-expr';
import { SimpleDrawDocument } from './document';
import { Render } from './render/render';
import { Terminal } from './terminal';

export class Controls {
  private terminal: Terminal;
  private readonly terminalElem: HTMLInputElement;
  private promptTextElem: HTMLInputElement;
  private readonly undoBtn: HTMLElement;
  private readonly redoBtn: HTMLElement;
  private readonly svgBtn: HTMLElement;
  private readonly canvasBtn: HTMLElement;
  private readonly importBtn: HTMLElement;
  private readonly exportXMLBtn: HTMLElement;
  private readonly exportJSONBtn: HTMLElement;
  private fileUploadForm: HTMLElement;
  constructor(
    private simpleDrawDocument: SimpleDrawDocument,
    private render: Render
  ) {
    this.terminalElem = document.getElementById('terminal') as HTMLInputElement;
    this.terminal = new Terminal(this.terminalElem);
    this.promptTextElem = this.terminal.getPromptTextElem();

    this.undoBtn = document.getElementById('undo-btn') as HTMLElement;
    this.redoBtn = document.getElementById('redo-btn') as HTMLElement;
    this.svgBtn = document.getElementById('svg-btn') as HTMLElement;
    this.canvasBtn = document.getElementById('canvas-btn') as HTMLElement;
    this.importBtn = document.getElementById('import-btn') as HTMLElement;
    this.exportXMLBtn = document.getElementById(
      'export-xml-btn'
    ) as HTMLElement;
    this.exportJSONBtn = document.getElementById(
      'export-json-btn'
    ) as HTMLElement;
    this.fileUploadForm = document.getElementById('file-upload') as HTMLElement;

    console.assert(this.undoBtn);
    console.assert(this.redoBtn);
    console.assert(this.svgBtn);
    console.assert(this.canvasBtn);
    console.assert(this.importBtn);
    console.assert(this.exportXMLBtn);
    console.assert(this.exportJSONBtn);

    this.bindEvents();
  }

  fileOnChange(event: Event) {
    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      // tslint:disable-next-line:ban-ts-ignore
      // @ts-ignore
      const fileContent = e.target.result;
      console.log(fileContent);
    };

    reader.readAsText(file);
  }

  bindEvents() {
    this.terminalElem.addEventListener('keydown', event => {
      if (event.code === 'Enter') {
        const expr = this.promptTextElem.value;
        this.terminal.print(expr);
        try {
          const res = new ExprAbstractExpr(
            this.simpleDrawDocument,
            this.render
          ).evaluate(expr);
          this.terminal.printSuccess(res);
        } catch (error) {
          this.terminal.printError(error.message);
        }
      }
    });

    this.fileUploadForm.onchange = e => this.fileOnChange(e);

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.undoBtn.onclick = () => {
      this.simpleDrawDocument.undo();
    };

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.redoBtn.onclick = () => {
      this.simpleDrawDocument.redo();
    };

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.svgBtn.onclick = () => {
      this.simpleDrawDocument.changeRender('svg');
    };

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.canvasBtn.onclick = () => {
      this.simpleDrawDocument.changeRender('canvas');
    };

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.importBtn.onclick = () => {
      // tslint:disable-next-line:ban-ts-ignore
      // @ts-ignore
      this.fileUploadForm.click();
    };

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.exportXMLBtn.onclick = () => {};

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    this.exportJSONBtn.onclick = () => {};
  }
}
