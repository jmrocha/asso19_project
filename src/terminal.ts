const PROMPT = '$ ';

export class Terminal {
  private promptLabelElem: HTMLElement;
  private readonly promptTextElem: HTMLInputElement;
  private readonly terminalContainer: HTMLElement;

  constructor(private elem: HTMLElement) {
    const label = document.createElement('label');
    const textArea = document.createElement('input');
    const terminalContainer = document.createElement('div');

    elem.className += ' terminal-text';

    label.setAttribute('class', 'terminal-output');
    textArea.setAttribute('class', 'terminal-text terminal-prompt');
    terminalContainer.setAttribute('id', 'terminal-container');

    label.innerText = PROMPT;
    label.appendChild(textArea);

    console.assert(this.elem);

    this.elem.appendChild(terminalContainer);
    this.terminalContainer = terminalContainer;

    this.promptLabelElem = label;
    this.promptTextElem = textArea;
    this.elem.appendChild(label);
    textArea.focus();

    this.elem.onclick = () => this.focus();
  }

  private write(value: string, type?: string): void {
    const e = document.createElement('span');

    if (!type) type = '';
    e.setAttribute('class', `terminal-output ${type}`);
    e.innerHTML = `${value}`;

    console.assert(this.terminalContainer);
    this.terminalContainer.appendChild(e);

    this.promptTextElem.value = '';
  }

  print(value: string) {
    this.write(`${PROMPT} ${value}`);
  }

  printSuccess(value: string) {
    this.write(value, 'output-success');
  }

  printError(value: string) {
    this.write(value, 'output-error');
  }

  getPromptTextElem(): HTMLInputElement {
    return this.promptTextElem;
  }

  focus() {
    this.promptTextElem.focus();
  }
}
