import React, { Children } from 'react';
import { Context } from './component/provider';
import { IContext, IContainerPanel, IPanelLike } from './interface';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
import { Panel } from './component/panel';

export interface Props {
  root: string;
  panels: IContainerPanel[];
  onChange?: (panels: IContainerPanel[]) => void;
  style?: React.CSSProperties;
}

export interface State {
  panels: IContainerPanel[];
}

export class App extends React.PureComponent<Props, State> {
  state: State = {
    panels: this.props.panels,
  };

  handleChange = (panels: IContainerPanel[]) => {
    const { onChange } = this.props;

    onChange && onChange(panels);
  };

  getCtxValue(): IContext {
    const { panels } = this.state;

    const contentMap: IContext['contentMap'] = {};
    React.Children.forEach(this.props.children, child => {
      contentMap[(child as any).key] = child;
    });

    const panelMap = keyBy(panels, 'id');

    const getParent = (id: string) => panelMap[panelMap[id].parentId];
    const getKids = (id: string) => panels.filter(child => child.parentId === id);

    const getAllSiblings = (id: string) =>
      panels.filter(child => child.parentId === panelMap[id].parentId);

    const getSiblings = (id: string) => getAllSiblings(id).filter(child => child.id !== id);
    const getSiblingIndex = (id: string) => getAllSiblings(id).findIndex(si => si.id === id);

    const getFlowDirection = (id: string) => get(getParent(id), 'contentDirection', 'v');
    const isFlowStart = (id: string) => getSiblingIndex(id) === 0;
    const isFlowEnd = (id: string) => getSiblingIndex(id) === getAllSiblings(id).length - 1;

    const getContent = (id: string) => contentMap[id] || <i>{id}</i>;

    const setPanel = (id: string, newPanel: IPanelLike) => {
      const newPanels = panels.map(_p => (_p.id === id ? newPanel : _p));

      this.setState({
        panels: newPanels,
      });

      this.handleChange(newPanels);
    };

    return {
      panels,
      contentMap,
      panelMap,
      getParent,
      getKids,
      getAllSiblings,
      getSiblings,
      getSiblingIndex,
      getContent,
      getFlowDirection,
      isFlowStart,
      isFlowEnd,
      setPanel,
    };
  }

  render() {
    const { root, style } = this.props;
    const ctx = this.getCtxValue();

    return (
      <div style={style}>
        <Context.Provider value={ctx}>
          <Panel data={ctx.panelMap[root]} />
        </Context.Provider>
      </div>
    );
  }
}
