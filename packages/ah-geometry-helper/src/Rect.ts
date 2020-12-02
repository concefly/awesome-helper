import { Point } from './Point';

/** 矩形 */
export class Rect {
  /** 判断坐标是否能组成矩形 */
  static isValid(x1: number, y1: number, x2: number, y2: number) {
    return x1 <= x2 && y1 <= y2;
  }

  static union(list: Rect[]): Rect {
    const [first, ...rest] = list;
    if (rest.length === 0) return first;

    return list.reduce((a, b) => a.union(b), first);
  }

  static intersection(list: Rect[]): Rect | null {
    const [first, ...rest] = list;
    if (rest.length === 0) return first;

    return list.reduce<Rect | null>((a, b) => (a ? a.intersection(b) : null), first);
  }

  constructor(readonly x1: number, readonly y1: number, readonly x2: number, readonly y2: number) {
    if (!Rect.isValid(x1, y1, x2, y2)) throw new Error(`坐标错误 (${x1}, ${y1}), (${x2}, ${y2})`);
  }

  get ym() {
    return this.y1 + (this.y2 - this.y1) / 2;
  }

  get xm() {
    return this.x1 + (this.x2 - this.x1) / 2;
  }

  get height() {
    return this.y2 - this.y1;
  }

  get width() {
    return this.x2 - this.x1;
  }

  /** @deprecated 改用 isInTarget */
  isInside(p: Point) {
    return p.isInsideTarget(this);
  }

  /** 在目标矩形内部 */
  isInsideTarget(target: Rect) {
    const { x1y1, x1y2, x2y1, x2y2 } = this.getPoints();
    return (
      x1y1.isInsideTarget(target) &&
      x1y2.isInsideTarget(target) &&
      x2y1.isInsideTarget(target) &&
      x2y2.isInsideTarget(target)
    );
  }

  size() {
    return this.height * this.width;
  }

  /** 求矩形并集 */
  union(t: Rect) {
    const x1 = Math.min(this.x1, t.x1);
    const x2 = Math.max(this.x2, t.x2);
    const y1 = Math.min(this.y1, t.y1);
    const y2 = Math.max(this.y2, t.y2);

    return new Rect(x1, y1, x2, y2);
  }

  /** 求矩形交集 */
  intersection(t: Rect): Rect | null {
    const ur = this.union(t);

    const x1 = this.x1 === ur.x1 ? t.x1 : this.x1;
    const x2 = this.x2 === ur.x2 ? t.x2 : this.x2;
    const y1 = this.y1 === ur.y1 ? t.y1 : this.y1;
    const y2 = this.y2 === ur.y2 ? t.y2 : this.y2;

    if (x1 === x2 || y1 === y2) return null;
    if (!Rect.isValid(x1, y1, x2, y2)) return null;

    return new Rect(x1, y1, x2, y2);
  }

  /** 获取矩形顶点 */
  getPoints() {
    return {
      // 左边 3 点
      x1y1: new Point(this.x1, this.y1),
      x1ym: new Point(this.x1, this.ym),
      x1y2: new Point(this.x1, this.y2),

      // 右边 3 点
      x2y1: new Point(this.x2, this.y1),
      x2ym: new Point(this.x2, this.ym),
      x2y2: new Point(this.x2, this.y2),

      // 上中点
      xmy2: new Point(this.xm, this.y2),

      // 下中点
      xmy1: new Point(this.xm, this.y1),

      // 中点
      xmym: new Point(this.xm, this.ym),
    };
  }
}
