import { Rectangle } from 'shapes/rectangle';
import { Circle } from 'shapes/circle';
import { Polygon } from 'shapes/polygon';
import { Triangle } from 'shapes/triangle';
import { Shape } from 'shapes/shape';

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
    return rectElement;
  }

  visitCircle(circle: Circle): Element {
    const circleElement: Element = this.xmlDoc.createElement('circle');
    return circleElement;
  }

  visitPolygon(polyg: Polygon): Element {
    const polygElement: Element = this.xmlDoc.createElement('polyg');
    return polygElement;
  }

  visitTriangle(triangle: Triangle): Element {
    const trianglegElement: Element = this.xmlDoc.createElement('triangle');
    return trianglegElement;
  }
}

//At the moment, this class is outputting the same thing as the XML one.

export class JSONExporterVisitor implements Visitor {
  constructor(private xmlDoc: XMLDocument) {}

  visitRectangle(rect: Rectangle): Element {
    const rectElement: Element = this.xmlDoc.createElement('rect');
    return rectElement;
  }

  visitCircle(circle: Circle): Element {
    const circleElement: Element = this.xmlDoc.createElement('circle');
    return circleElement;
  }

  visitPolygon(polyg: Polygon): Element {
    const polygElement: Element = this.xmlDoc.createElement('polyg');
    return polygElement;
  }

  visitTriangle(triangle: Triangle): Element {
    const triangleElement: Element = this.xmlDoc.createElement('triangle');
    return triangleElement;
  }
}
