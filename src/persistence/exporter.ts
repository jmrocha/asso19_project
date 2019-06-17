import { Rectangle } from 'shapes/rectangle';
import { Circle } from 'shapes/circle';
import { Polygon } from 'shapes/polygon';
import { Triangle } from 'shapes/triangle';
import { Shape } from 'shapes/shape';
import { SimpleDrawDocument } from 'document';
import { SVGRender } from 'render/svg-render';
import { Coordinate } from 'utilities/coordinate';
import { connect } from 'mqtt';
import { DrawAbstractExpr } from 'repl/draw-abstract-expr';
import { defaultRender } from 'index';

//Strategy Pattern

export interface Strategy {
  execute(objects: Shape[], currentDocument: SimpleDrawDocument): void;
}

export class ConcreteStrategyXMLExp implements Strategy {
  execute(objects: Shape[], currentDocument: SimpleDrawDocument): void {
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
  execute(objects: Shape[], currentDocument: SimpleDrawDocument): void {
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

    //Convert Xml to Json
    const convert = require('xml-js');
    const xml = new XMLSerializer().serializeToString(xmlDoc.documentElement);
    const options = { ignoreComment: true, compact: false };
    const result = convert.xml2json(xml, options);

    //Download File
    const fileSaver = require('file-saver');
    const blob = new Blob([result], { type: 'data:text/plain;charset=utf-8' });
    fileSaver.saveAs(blob, 'newJsonDoc.json');
  }
}

export class ConcreteStrategyXMLImp implements Strategy {
  constructor(content: string) {
    this.fileContent = content;
  }

  private fileContent: string;

  execute(objects: Shape[], currentDocument: SimpleDrawDocument): void {
    const importedXMLFile = this.fileContent;

    const xmlReader = require('xml-reader');
    const ast = xmlReader.parseSync(importedXMLFile);

    //After importing, we search the shapes in the XML and draw them
    const xmlQuery = require('xml-query');
    const numChildren = xmlQuery(ast)
      .find('shapes')
      .children()
      .size();

    const newShapes = new Array<Shape>();

    for (let i = 0; i < numChildren; i++) {
      const eachShape = xmlQuery(ast)
        .find('shapes')
        .children()
        .get(i);

      const eachShapeName = eachShape['name'];
      const eachShapeAttributes = eachShape.attributes;

      const id = eachShapeAttributes['id'];
      const fillColor = eachShapeAttributes['fillColor'];
      const rotation = eachShapeAttributes['rotation'];
      const scaleX = eachShapeAttributes['scaleX'];
      const scaleY = eachShapeAttributes['scaleY'];

      switch (eachShapeName) {
        case 'rect': {
          const coordX = eachShapeAttributes['x'];
          const coordY = eachShapeAttributes['y'];
          const height = eachShapeAttributes['height'];
          const width = eachShapeAttributes['width'];

          const newRect = new Rectangle(id, coordX, coordY, width, height);
          newRect.fillColor = fillColor;
          newRect.rotation = rotation;
          newRect.scaleX = scaleX;
          newRect.scaleY = scaleY;

          newShapes.push(newRect);
          break;
        }
        case 'circle': {
          const coordX = eachShapeAttributes['x'];
          const coordY = eachShapeAttributes['y'];
          const radius = eachShapeAttributes['radius'];

          const newCircle = new Circle(id, coordX, coordY, radius);
          newCircle.fillColor = fillColor;
          newCircle.rotation = rotation;
          newCircle.scaleX = scaleX;
          newCircle.scaleY = scaleY;

          newShapes.push(newCircle);
          break;
        }
        case 'polyg': {
          const numCoords = eachShapeAttributes['numCoords'];
          const coordsArray: Coordinate[] = [];

          for (let i = 0; i < numCoords; i++) {
            const pString = 'p';
            const number1 = i + 1;
            const xString = 'x';
            const yString = 'y';
            const xFinalStr = pString + number1 + xString;
            const yFinalStr = pString + number1 + yString;

            const px = eachShapeAttributes[xFinalStr];
            const py = eachShapeAttributes[yFinalStr];
            const coord = new Coordinate(px, py);
            coordsArray.push(coord);
          }

          const newPolyg = new Polygon(id, ...coordsArray);
          newPolyg.fillColor = fillColor;
          newPolyg.rotation = rotation;
          newPolyg.scaleX = scaleX;
          newPolyg.scaleY = scaleY;

          newShapes.push(newPolyg);
          break;
        }
        case 'triangle': {
          const p1x = eachShapeAttributes['p1x'];
          const p1y = eachShapeAttributes['p1y'];
          const p2x = eachShapeAttributes['p2x'];
          const p2y = eachShapeAttributes['p2y'];
          const p3x = eachShapeAttributes['p3x'];
          const p3y = eachShapeAttributes['p3y'];

          const newTriangle = new Triangle(
            id,
            new Coordinate(p1x, p1y),
            new Coordinate(p2x, p2y),
            new Coordinate(p3x, p3y)
          );

          newTriangle.fillColor = fillColor;
          newTriangle.rotation = rotation;
          newTriangle.scaleX = scaleX;
          newTriangle.scaleY = scaleY;

          newShapes.push(newTriangle);
          break;
        }
        default: {
          break;
        }
      }
    }

    currentDocument.objects = newShapes;
    currentDocument.draw();
  }
}

export class ConcreteStrategyJSONImp implements Strategy {
  constructor(content: string) {
    this.fileContent = content;
  }

  private fileContent: string;

  execute(objects: Shape[], currentDocument: SimpleDrawDocument): void {
    const importedJSONFile = this.fileContent;

    //Convert Json to Xml
    const convert = require('xml-js');
    const options = { ignoreComment: true, compact: false };
    const result = convert.json2xml(importedJSONFile, options);

    const xmlReader = require('xml-reader');
    const ast = xmlReader.parseSync(result);

    //After importing, we search the shapes in the XML and draw them
    const xmlQuery = require('xml-query');
    const numChildren = xmlQuery(ast)
      .find('shapes')
      .children()
      .size();

    const newShapes = new Array<Shape>();

    for (let i = 0; i < numChildren; i++) {
      const eachShape = xmlQuery(ast)
        .find('shapes')
        .children()
        .get(i);

      const eachShapeName = eachShape['name'];
      const eachShapeAttributes = eachShape.attributes;

      const id = eachShapeAttributes['id'];
      const fillColor = eachShapeAttributes['fillColor'];
      const rotation = eachShapeAttributes['rotation'];
      const scaleX = eachShapeAttributes['scaleX'];
      const scaleY = eachShapeAttributes['scaleY'];

      switch (eachShapeName) {
        case 'rect': {
          const coordX = eachShapeAttributes['x'];
          const coordY = eachShapeAttributes['y'];
          const height = eachShapeAttributes['height'];
          const width = eachShapeAttributes['width'];

          const newRect = new Rectangle(id, coordX, coordY, width, height);
          newRect.fillColor = fillColor;
          newRect.rotation = rotation;
          newRect.scaleX = scaleX;
          newRect.scaleY = scaleY;

          newShapes.push(newRect);
          break;
        }
        case 'circle': {
          const coordX = eachShapeAttributes['x'];
          const coordY = eachShapeAttributes['y'];
          const radius = eachShapeAttributes['radius'];

          const newCircle = new Circle(id, coordX, coordY, radius);
          newCircle.fillColor = fillColor;
          newCircle.rotation = rotation;
          newCircle.scaleX = scaleX;
          newCircle.scaleY = scaleY;

          newShapes.push(newCircle);
          break;
        }
        case 'polyg': {
          const numCoords = eachShapeAttributes['numCoords'];
          const coordsArray: Coordinate[] = [];

          for (let i = 0; i < numCoords; i++) {
            const pString = 'p';
            const number1 = i + 1;
            const xString = 'x';
            const yString = 'y';
            const xFinalStr = pString + number1 + xString;
            const yFinalStr = pString + number1 + yString;

            const px = eachShapeAttributes[xFinalStr];
            const py = eachShapeAttributes[yFinalStr];
            const coord = new Coordinate(px, py);
            coordsArray.push(coord);
          }

          const newPolyg = new Polygon(id, ...coordsArray);
          newPolyg.fillColor = fillColor;
          newPolyg.rotation = rotation;
          newPolyg.scaleX = scaleX;
          newPolyg.scaleY = scaleY;

          newShapes.push(newPolyg);
          break;
        }
        case 'triangle': {
          const p1x = eachShapeAttributes['p1x'];
          const p1y = eachShapeAttributes['p1y'];
          const p2x = eachShapeAttributes['p2x'];
          const p2y = eachShapeAttributes['p2y'];
          const p3x = eachShapeAttributes['p3x'];
          const p3y = eachShapeAttributes['p3y'];

          const newTriangle = new Triangle(
            id,
            new Coordinate(p1x, p1y),
            new Coordinate(p2x, p2y),
            new Coordinate(p3x, p3y)
          );

          newTriangle.fillColor = fillColor;
          newTriangle.rotation = rotation;
          newTriangle.scaleX = scaleX;
          newTriangle.scaleY = scaleY;

          newShapes.push(newTriangle);
          break;
        }
        default: {
          break;
        }
      }
    }

    currentDocument.objects = newShapes;
    currentDocument.draw();
  }
}

export class Context {
  private strategy!: Strategy;

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  executeStrategy(objects: Shape[], currentDocument: SimpleDrawDocument) {
    return this.strategy.execute(objects, currentDocument);
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

    rectElement.setAttribute('id', rect.getId().toString());
    rectElement.setAttribute('x', rect.coordinates[0].x.toString());
    rectElement.setAttribute('y', rect.coordinates[0].y.toString());
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

    circleElement.setAttribute('id', circle.getId().toString());
    circleElement.setAttribute('x', circle.coordinates[0].x.toString());
    circleElement.setAttribute('y', circle.coordinates[0].y.toString());
    circleElement.setAttribute('radius', circle.radius.toString());
    circleElement.setAttribute('fillColor', circle.fillColor);
    circleElement.setAttribute('rotation', circle.rotation.toString());
    circleElement.setAttribute('scaleX', circle.scaleX.toString());
    circleElement.setAttribute('scaleY', circle.scaleY.toString());

    return circleElement;
  }

  visitPolygon(polyg: Polygon): Element {
    const polygElement: Element = this.xmlDoc.createElement('polyg');

    polygElement.setAttribute('id', polyg.getId().toString());

    const numCoords = polyg.coordinates.length;

    for (let i = 0; i < numCoords; i++) {
      const pString = 'p';
      const number1 = i + 1;
      const xString = 'x';
      const yString = 'y';
      const xFinalStr = pString + number1 + xString;
      const yFinalStr = pString + number1 + yString;

      polygElement.setAttribute(xFinalStr, polyg.coordinates[i].x.toString());
      polygElement.setAttribute(yFinalStr, polyg.coordinates[i].y.toString());
    }

    polygElement.setAttribute('numCoords', numCoords.toString());
    polygElement.setAttribute('fillColor', polyg.fillColor);
    polygElement.setAttribute('rotation', polyg.rotation.toString());
    polygElement.setAttribute('scaleX', polyg.scaleX.toString());
    polygElement.setAttribute('scaleY', polyg.scaleY.toString());

    return polygElement;
  }

  visitTriangle(triangle: Triangle): Element {
    const triangleElement: Element = this.xmlDoc.createElement('triangle');

    triangleElement.setAttribute('id', triangle.getId().toString());
    triangleElement.setAttribute('p1x', triangle.coordinates[0].x.toString());
    triangleElement.setAttribute('p1y', triangle.coordinates[0].y.toString());
    triangleElement.setAttribute('p2x', triangle.coordinates[1].x.toString());
    triangleElement.setAttribute('p2y', triangle.coordinates[1].y.toString());
    triangleElement.setAttribute('p3x', triangle.coordinates[2].x.toString());
    triangleElement.setAttribute('p3y', triangle.coordinates[2].y.toString());
    triangleElement.setAttribute('fillColor', triangle.fillColor);
    triangleElement.setAttribute('rotation', triangle.rotation.toString());
    triangleElement.setAttribute('scaleX', triangle.scaleX.toString());
    triangleElement.setAttribute('scaleY', triangle.scaleY.toString());

    return triangleElement;
  }
}
