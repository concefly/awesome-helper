import { IPanelSpan, IPanelSpanMap, IPanelLike, IContainerPanel } from './interface';
import some from 'lodash/some';

export const isFlexSpan = (span: IPanelSpan): span is IPanelSpanMap['flex'] => {
  return span.type === 'flex';
};
export const isFloatSpan = (span: IPanelSpan): span is IPanelSpanMap['float'] => {
  return span.type === 'float';
};

/** 是否 container panel */
export function isContainerPanel(
  panel: IPanelLike,
  panelMap: { [id: string]: IPanelLike }
): panel is IContainerPanel {
  const hasChild = some(panelMap, child => child.parentId === panel.id);

  return hasChild;
}
