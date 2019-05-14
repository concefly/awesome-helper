import React from 'react';
import { IPanelProps } from '../../interface';
import flowRight from 'lodash/flowRight';
import { withLayout, withSibling, withParent, withKids, withContent } from './hoc';

type Props = IPanelProps;

export class PanelBase extends React.PureComponent<Props> {
  render() {
    const { id, kids, content } = this.props;

    console.log('@@@', 'this.props ->', this.props);

    if (kids.length) {
      return kids.map(kid => <Panel key={kid.id} {...kid} />);
    } else {
      return <div data-p-id={id}>{content}</div>;
    }
  }
}

export const Panel: React.ClassicComponentClass<Props> = flowRight([
  withLayout,
  withSibling,
  withParent,
  withKids,
  withContent,
])(PanelBase);
