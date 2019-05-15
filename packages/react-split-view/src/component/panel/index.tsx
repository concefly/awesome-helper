import React from 'react';
import { IPanelProps } from '../../interface';
import flowRight from 'lodash/flowRight';
import { withLayout, withResize, withContext } from './hoc';

export class PanelBase extends React.PureComponent<IPanelProps> {
  render() {
    const {
      data: { id },
      ctx,
    } = this.props;

    const kids = ctx.getKids(id);
    const content = ctx.getContent(id);

    // console.log('@@@', 'this.props ->', this.props);

    if (kids.length) {
      return kids.map(kid => <Panel key={kid.id} data={kid} />);
    } else {
      return <div data-p-id={id}>{content}</div>;
    }
  }
}

export const Panel: React.ClassicComponentClass<IPanelProps> = flowRight([
  // 以下顺序不要随便调整
  withContext,
  withResize,
  withLayout,
])(PanelBase);
