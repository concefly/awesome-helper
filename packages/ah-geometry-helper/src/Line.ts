import { Point } from './Point';

/** 直线类 */
export class Line {
  static fromPoints(p1: Point, p2: Point) {
    return new Line(p1.x, p1.y, p2.x, p2.y);
  }

  constructor(readonly x1: number, readonly y1: number, readonly x2: number, readonly y2: number) {
    if (x1 === x2 && x1 === y1 && y1 === y2) {
      throw new Error(`坐标错误 (${x1}, ${y1}), (${x2}, ${y2})`);
    }
  }

  readonly a = this.y2 - this.y1;
  readonly b = this.x1 - this.x2;
  readonly c = this.x2 * this.y1 - this.x1 * this.y2;

  isOnLine(p: Point) {
    return Math.abs(this.a * p.x + this.b * p.y + this.c) < Number.MIN_VALUE;
  }

  /** 点到线的距离，可能是负数 */
  getDistance(p: Point) {
    const { a, b, c } = this;
    return (a * p.x + b * p.y + c) / Math.sqrt(a * a + b * b);
  }

  /** 垂足点 */
  getPedalPoint(p: Point): Point {
    const a2b2 = this.a * this.a + this.b * this.b;

    const x = (p.x * this.b * this.b - this.a * this.b * p.y - this.a * this.c) / a2b2;
    const y = (p.y * this.a * this.a - this.a * this.b * p.x - this.b * this.c) / a2b2;

    return new Point(x, y);
  }
}
