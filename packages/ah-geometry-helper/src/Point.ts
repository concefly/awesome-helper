import { Rect } from './Rect';
import { inRange } from './util';

export class Point {
  constructor(readonly x: number, readonly y: number) {}

  getDistance(p: Point) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** 在目标矩形内部 */
  isInsideTarget(r: Rect) {
    return inRange(this.x, r.x1, r.x2) && inRange(this.y, r.y1, r.y2);
  }
}
