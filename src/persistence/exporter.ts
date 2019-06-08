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
    //console.log("XMLConcreteStrategy");
    const visitor = new XMLExporterVisitor();
    for (const shape of objects) {
      console.log(shape.accept(visitor));
    }
  }
}

export class ConcreteStrategyJSON implements Strategy {
  execute(objects: Shape[]): void {
    const visitor = new JSONExporterVisitor();
    for (const shape of objects) {
      console.log(shape.accept(visitor));
    }
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
  visitRectangle(rect: Rectangle): string;
  visitCircle(circle: Circle): string;
  visitPolygon(polyg: Polygon): string;
  visitTriangle(triangle: Triangle): string;
}

export class XMLExporterVisitor implements Visitor {
  visitRectangle(rect: Rectangle): string {
    return 'rectangle1';
  }

  visitCircle(circle: Circle): string {
    return 'circle1';
  }

  visitPolygon(polyg: Polygon): string {
    return 'polygon1';
  }

  visitTriangle(triangle: Triangle): string {
    return 'triangle1';
  }
}

export class JSONExporterVisitor implements Visitor {
  visitRectangle(rect: Rectangle): string {
    return 'rectangle2';
  }

  visitCircle(circle: Circle): string {
    return 'circle2';
  }

  visitPolygon(polyg: Polygon): string {
    return 'polygon2';
  }

  visitTriangle(triangle: Triangle): string {
    return 'triangle2';
  }
}
