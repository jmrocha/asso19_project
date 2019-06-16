export class Tools {
  static download(filename: string, content: string) {
    const element1 = document.createElement('element1');
    element1.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element1.setAttribute('download', filename);
    element1.style.display = 'none';
    document.body.appendChild(element1);

    element1.click();

    document.body.removeChild(element1);
  }
}
