import React from 'react';
import { Context } from './component/provider';
import { IContext, IContainerPanel } from './interface';
import keyBy from 'lodash/keyBy';
import { Panel } from './component/panel';

export interface Props {
  root: string;
  panels: IContainerPanel[];
  contentMap: {
    [id: string]: any;
  };
}

export class App extends React.PureComponent<Props> {
  getCtxValue(): IContext {
    const { panels, contentMap } = this.props;

    const panelMap = keyBy(panels, 'id');

    return {
      panels,
      panelMap,
      contentMap,
    };
  }

  render() {
    const { root } = this.props;
    const ctx = this.getCtxValue();

    return (
      <Context.Provider value={ctx}>
        <Panel {...ctx.panelMap[root]} />
      </Context.Provider>
    );
  }
}
