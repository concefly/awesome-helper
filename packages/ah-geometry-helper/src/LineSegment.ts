import { Line } from './Line';
import { Point } from './Point';

/** 线段 */
export class LineSegment extends Line {
  isOnLine(p: Point): boolean {
    return (
      super.isOnLine(p) && this.x1 <= p.x && p.x <= this.x2 && this.y1 <= p.y && p.y <= this.y2
    );
  }

  /** 获取延长线 */
  getExtendLine(p: Point): Line | undefined {
    if (this.isOnLine(p)) return;

    const p1 = new Point(this.x1, this.y1);
    const p2 = new Point(this.x2, this.y2);

    // 与更近的点连接
    return p.getDistance(p1) < p.getDistance(p2) ? Line.fromPoints(p, p1) : Line.fromPoints(p, p2);
  }
}
