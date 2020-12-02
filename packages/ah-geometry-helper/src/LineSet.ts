import { IDirType } from './IDirType';
import { Line } from './Line';
import { Point } from './Point';
import { minBy } from './util';

/** 直线集合 */
export class LineSet<L extends Line = Line> {
  constructor(readonly lines: L[]) {}

  filterByDir(p: Point, dir: IDirType) {
    const newLines = this.lines.filter(l => {
      const pp = l.getPedalPoint(p);

      if (dir === 'left') return pp.x < p.x;
      if (dir === 'top') return pp.y < p.y;
      if (dir === 'right') return p.x < pp.x;
      if (dir === 'bottom') return p.y < pp.y;

      return false;
    });

    return new LineSet<L>(newLines);
  }

  filter(tester: (l: L) => boolean) {
    const newLines = this.lines.filter(tester);
    return new LineSet<L>(newLines);
  }

  /** 最近直线 */
  getNearestLine(p: Point): L | undefined {
    const line = minBy(this.lines, l => Math.abs(l.getDistance(p)));
    return line;
  }
}
