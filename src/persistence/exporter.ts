import { Rectangle } from 'shapes/rectangle';
import { Circle } from 'shapes/circle';
import { Polygon } from 'shapes/polygon';
import { Triangle } from 'shapes/triangle';
import { Shape } from 'shapes/shape';
import { Tools } from 'utilities/tools';

//Strategy Pattern

export interface Strategy {
  execute(objects: Shape[]): void;
}

export class ConcreteStrategyXMLExp implements Strategy {
  execute(objects: Shape[]): void {
    const xmlDoc: XMLDocument = document.implementation.createDocument(
      '',
      '',
      null
    );
    const storedShapes = xmlDoc.createElement('shapes');

    const visitor = new XMLExporterVisitor(xmlDoc);

    for (const shape of objects) {
      storedShapes.appendChild(shape.accept(visitor));
    }

    xmlDoc.appendChild(storedShapes);
    console.log(xmlDoc);

    //Download File

    const xmlDocString = new XMLSerializer().serializeToString(
      xmlDoc.documentElement
    );
    const fileSaver = require('file-saver');
    const blob = new Blob([xmlDocString], {
      type: 'data:text/plain;charset=utf-8',
    });
    fileSaver.saveAs(blob, 'newXmlDoc.xml');
  }
}

export class ConcreteStrategyJSONExp implements Strategy {
  execute(objects: Shape[]): void {
    const xmlDoc: XMLDocument = document.implementation.createDocument(
      '',
      '',
      null
    );
    const storedShapes = xmlDoc.createElement('shapes');

    const visitor = new XMLExporterVisitor(xmlDoc);

    for (const shape of objects) {
      storedShapes.appendChild(shape.accept(visitor));
    }

    xmlDoc.appendChild(storedShapes);
    console.log(xmlDoc);

    //Convert Xml to Json
    const convert = require('xml-js');
    const xml = new XMLSerializer().serializeToString(xmlDoc.documentElement);
    //var xml = require('fs').readFileSync('newXmlDoc.xml', 'utf8');
    const options = { ignoreComment: true, compact: false };
    const result = convert.xml2json(xml, options);
    console.log('Json : \n ' + result);

    //Download File

    const fileSaver = require('file-saver');
    const blob = new Blob([result], { type: 'data:text/plain;charset=utf-8' });
    fileSaver.saveAs(blob, 'newJsonDoc.xml');
  }
}

export class ConcreteStrategyXMLImp implements Strategy {
  constructor(content: string) {
    this.fileContent = content;
  }

  private fileContent: string;

  execute(objects: Shape[]): void {
    //const importedXML = this.fileContent;
    const importedXML =
      '<shapes><rect coordinates="X: 400 Y: 400" width="50" height="50" fillColor="red" rotation="0" scaleX="1.5" scaleY="1.5"/><circle coordinates="X: 200 Y: 200" radius="50" fillColor="white" rotation="0" scaleX="1" scaleY="1"/><circle coordinates="X: 500 Y: 200" radius="50" fillColor="white" rotation="0" scaleX="1" scaleY="1"/></shapes>';

    const parseXML = require('xml-parse-from-string');

    const xmldoc = parseXML(importedXML);

    console.log('Parsing XML:\n\nXml String:\n' + importedXML);
    console.log('XML document:');
    console.log(xmldoc);

    //After importing, we search the shapes in the XML and draw them

    /*
    const xmlDoc: XMLDocument = document.implementation.createDocument(
      '',
      '',
      null 
    );
    const storedShapes = xmlDoc.createElement('shapes');

    const visitor = new JSONExporterVisitor(xmlDoc);

    for (const shape of objects) {
      storedShapes.appendChild(shape.accept(visitor));
    }
 
    xmlDoc.appendChild(storedShapes);
    console.log(xmlDoc);  
*/
  }
}

export class ConcreteStrategyJSONImp implements Strategy {
  constructor(content: string) {
    this.fileContent = content;
  }

  private fileContent: string;

  execute(objects: Shape[]): void {
    //const importedJSON = fileContent;
    const importedJSON =
      '{"elements":[{"type":"element","name":"shapes","elements":[{"type":"element","name":"rect","attributes":{"coordinates":"X: 400 Y: 400","width":"50","height":"50","fillColor":"red","rotation":"0","scaleX":"1.5","scaleY":"1.5"}},{"type":"element","name":"circle","attributes":{"coordinates":"X: 200 Y: 200","radius":"50","fillColor":"white","rotation":"0","scaleX":"1","scaleY":"1"}},{"type":"element","name":"circle","attributes":{"coordinates":"X: 500 Y: 200","radius":"50","fillColor":"white","rotation":"0","scaleX":"1","scaleY":"1"}}]}]}';

    //Convert Json to Xml
    const convert = require('xml-js');
    //const json = new XMLSerializer().serializeToString(xmlDoc.documentElement);
    //var xml = require('fs').readFileSync('newXmlDoc.xml', 'utf8');
    const options = { ignoreComment: true, compact: false };
    const result = convert.json2xml(importedJSON, options);

    console.log('Parsing JSON:\n\nJson string:\n' + importedJSON);
    console.log('XML string:\n' + result);

    const parseXML = require('xml-parse-from-string');

    //const oParser = new DOMParser();
    //const xmldoc = oParser.parseFromString(result, 'text/xml');

    const doc = parseXML(result);
    //const doc = parseXML(xmldoc);

    console.log('XML Document:');
    console.log(doc);

    //After importing, we search the shapes in the XML and draw them

    /*
    const jsonDoc: XMLDocument = document.implementation.createDocument(
      '',
      '',
      null 
    );
    const storedShapes = jsonDoc.createElement('shapes');

    const visitor = new JSONExporterVisitor(jsonDoc);

    for (const shape of objects) {
      storedShapes.appendChild(shape.accept(visitor));
    }

    jsonDoc.appendChild(storedShapes);
    console.log(jsonDoc);

    */
  }
}

export class Context {
  private strategy!: Strategy;

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  executeStrategy(objects: Shape[]) {
    return this.strategy.execute(objects);
  }
}

// Visitor Pattern

export interface Visitor {
  visitRectangle(rect: Rectangle): Element;
  visitCircle(circle: Circle): Element;
  visitPolygon(polyg: Polygon): Element;
  visitTriangle(triangle: Triangle): Element;
}

export class XMLExporterVisitor implements Visitor {
  constructor(private xmlDoc: XMLDocument) {}

  visitRectangle(rect: Rectangle): Element {
    const rectElement: Element = this.xmlDoc.createElement('rect');

    //rectElement.setAttribute("x", rect.coordinates[0].toString());
    //rectElement.setAttribute("y", rect.coordinates[1].toString());
    rectElement.setAttribute('coordinates', rect.coordinates.toString());
    rectElement.setAttribute('width', rect.width.toString());
    rectElement.setAttribute('height', rect.height.toString());
    rectElement.setAttribute('fillColor', rect.fillColor);
    rectElement.setAttribute('rotation', rect.rotation.toString());
    rectElement.setAttribute('scaleX', rect.scaleX.toString());
    rectElement.setAttribute('scaleY', rect.scaleY.toString());

    return rectElement;
  }

  visitCircle(circle: Circle): Element {
    const circleElement: Element = this.xmlDoc.createElement('circle');

    circleElement.setAttribute('coordinates', circle.coordinates.toString());
    circleElement.setAttribute('radius', circle.radius.toString());
    circleElement.setAttribute('fillColor', circle.fillColor);
    circleElement.setAttribute('rotation', circle.rotation.toString());
    circleElement.setAttribute('scaleX', circle.scaleX.toString());
    circleElement.setAttribute('scaleY', circle.scaleY.toString());

    return circleElement;
  }

  visitPolygon(polyg: Polygon): Element {
    const polygElement: Element = this.xmlDoc.createElement('polyg');

    polygElement.setAttribute('coordinates', polyg.coordinates.toString());
    polygElement.setAttribute('fillColor', polyg.fillColor);
    polygElement.setAttribute('rotation', polyg.rotation.toString());
    polygElement.setAttribute('scaleX', polyg.scaleX.toString());
    polygElement.setAttribute('scaleY', polyg.scaleY.toString());

    return polygElement;
  }

  visitTriangle(triangle: Triangle): Element {
    const triangleElement: Element = this.xmlDoc.createElement('triangle');

    triangleElement.setAttribute(
      'coordinates',
      triangle.coordinates.toString()
    );
    triangleElement.setAttribute('fillColor', triangle.fillColor);
    triangleElement.setAttribute('rotation', triangle.rotation.toString());
    triangleElement.setAttribute('scaleX', triangle.scaleX.toString());
    triangleElement.setAttribute('scaleY', triangle.scaleY.toString());

    return triangleElement;
  }
}

//At the moment, this class is worthless. Delete if is isn't being used

export class JSONExporterVisitor implements Visitor {
  constructor(private xmlDoc: XMLDocument) {}

  visitRectangle(rect: Rectangle): Element {
    const rectElement: Element = this.xmlDoc.createElement('rect');

    //rectElement.setAttribute("x", rect.coordinates[0].toString());
    //rectElement.setAttribute("y", rect.coordinates[1].toString());
    rectElement.setAttribute('coordinates', rect.coordinates.toString());
    rectElement.setAttribute('width', rect.width.toString());
    rectElement.setAttribute('height', rect.height.toString());
    rectElement.setAttribute('fillColor', rect.fillColor);
    rectElement.setAttribute('rotation', rect.rotation.toString());
    rectElement.setAttribute('scaleX', rect.scaleX.toString());
    rectElement.setAttribute('scaleY', rect.scaleY.toString());

    return rectElement;
  }

  visitCircle(circle: Circle): Element {
    const circleElement: Element = this.xmlDoc.createElement('circle');

    circleElement.setAttribute('coordinates', circle.coordinates.toString());
    circleElement.setAttribute('radius', circle.radius.toString());
    circleElement.setAttribute('fillColor', circle.fillColor);
    circleElement.setAttribute('rotation', circle.rotation.toString());
    circleElement.setAttribute('scaleX', circle.scaleX.toString());
    circleElement.setAttribute('scaleY', circle.scaleY.toString());

    return circleElement;
  }

  visitPolygon(polyg: Polygon): Element {
    const polygElement: Element = this.xmlDoc.createElement('polyg');

    polygElement.setAttribute('coordinates', polyg.coordinates.toString());
    polygElement.setAttribute('fillColor', polyg.fillColor);
    polygElement.setAttribute('rotation', polyg.rotation.toString());
    polygElement.setAttribute('scaleX', polyg.scaleX.toString());
    polygElement.setAttribute('scaleY', polyg.scaleY.toString());

    return polygElement;
  }

  visitTriangle(triangle: Triangle): Element {
    const triangleElement: Element = this.xmlDoc.createElement('triangle');

    triangleElement.setAttribute(
      'coordinates',
      triangle.coordinates.toString()
    );
    triangleElement.setAttribute('fillColor', triangle.fillColor);
    triangleElement.setAttribute('rotation', triangle.rotation.toString());
    triangleElement.setAttribute('scaleX', triangle.scaleX.toString());
    triangleElement.setAttribute('scaleY', triangle.scaleY.toString());

    return triangleElement;
  }
}
