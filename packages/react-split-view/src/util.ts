import { IPanelLike } from './interface';
import sum from 'lodash/sum';

export function calcPanelPxMap(
  containerPx: number,
  panels: IPanelLike[]
): { [key: string]: number } {
  const result: { [key: string]: number } = {};

  const totalPercent = Math.max(
    sum(panels.map(p => p.span.spanPercent)),
    // 最大 100
    100
  );

  panels.forEach(p => {
    result[p.key] = Math.round(containerPx * (p.span.spanPercent / totalPercent));
  });

  return result;
}
