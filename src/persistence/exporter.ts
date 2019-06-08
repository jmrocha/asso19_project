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

export class ConcreteStrategyXML implements Strategy {
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

    Tools.download(
      'newXmlDoc.xml',
      new XMLSerializer().serializeToString(xmlDoc.documentElement)
    );
  }
}

//At the moment, this class is outputting the same thing as the XML one.
export class ConcreteStrategyJSON implements Strategy {
  execute(objects: Shape[]): void {
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

    //Tools.download("newXmlDoc.xml", jsonDoc);
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

//At the moment, this class is outputting the same thing as the XML one.

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
