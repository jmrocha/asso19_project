import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Triangle extends Shape {
    constructor(public p1: Coordinate, public p2: Coordinate, public p3: Coordinate) {
        super(p1, p2, p3);
    }
}