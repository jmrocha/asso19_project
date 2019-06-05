import { Shape } from './shape';
import { Coordinate } from '../utilities/coordinate';

export class Polygon extends Shape {
    constructor(...coordinates: Coordinate[]) {
        super(...coordinates);
    }
}