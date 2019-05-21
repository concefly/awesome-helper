import React from 'react';
import { Context } from './component/provider';
import { IContext, IContainerPanel, IPanelLike, IPanelRuntimeMeta } from './interface';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
import { Panel } from './component/panel';

export interface Props {
  root: string;
  defaultValue?: IContainerPanel[];
  value?: IContainerPanel[];
  onChange?: (value: IContainerPanel[]) => void;
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  resizingBoxStyle?: React.CSSProperties;
}

export interface State {
  value: IContainerPanel[];
}

export class App extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    root: 'root',
    resizingBoxStyle: {
      zIndex: 99999999,
    },
  };

  static getDerivedStateFromProps(np: Props, state: State) {
    return { value: 'value' in np ? np.value : state.value } as State;
  }

  state: State = {
    value: this.props.value || this.props.defaultValue,
  };

  panelRuntimeMetaMap: {
    [id: string]: IPanelRuntimeMeta;
  } = {};

  handleChange = (panels: IContainerPanel[]) => {
    const { onChange } = this.props;

    onChange && onChange(panels);
  };

  getCtxValue(): IContext {
    const { resizingBoxStyle, panelStyle, children } = this.props;
    const { value: panels } = this.state;

    const contentMap = {};
    const childrenList = Array.isArray(children) ? children : [children];

    childrenList.forEach((child: any) => {
      const key = child.key;
      contentMap[key] = child;
    });

    const panelMap = keyBy(panels, 'id');

    const getPanel = (id: string) => panelMap[id];

    const getParent = (id: string) => panelMap[panelMap[id].parentId];
    const getKids = (id: string) => panels.filter(child => child.parentId === id);

    const getAllSiblings = (id: string) =>
      panels.filter(child => child.parentId === panelMap[id].parentId);

    const getSiblings = (id: string) => getAllSiblings(id).filter(child => child.id !== id);
    const getSiblingIndex = (id: string) => getAllSiblings(id).findIndex(si => si.id === id);

    const getFlowDirection = (id: string) => get(getParent(id), 'contentDirection', 'v');
    const isFlowStart = (id: string) => getSiblingIndex(id) === 0;
    const isFlowEnd = (id: string) => getSiblingIndex(id) === getAllSiblings(id).length - 1;

    const getPanelRuntimeMeta = (id: string) => this.panelRuntimeMetaMap[id];

    const getContent = (id: string) => contentMap[id] || <i>{id}</i>;

    const setPanel = (id: string, newPanel: IPanelLike) => {
      const newPanels = panels.map(_p => (_p.id === id ? newPanel : _p));

      this.setState({
        value: newPanels,
      });

      this.handleChange(newPanels);
    };

    const setPanelRuntimeMeta = (id: string, meta: IPanelRuntimeMeta) => {
      this.panelRuntimeMetaMap[id] = meta;
    };

    const getStyle = (id: string) => {
      void id;
      return {
        resizingBox: resizingBoxStyle,
        panel: panelStyle,
      };
    };

    return {
      getPanel,
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
      getPanelRuntimeMeta,
      setPanelRuntimeMeta,
      getStyle,
    };
  }

  render() {
    const { root, style } = this.props;
    const ctx = this.getCtxValue();

    return (
      <div style={style}>
        <Context.Provider value={ctx}>
          <Panel id={root} />
        </Context.Provider>
      </div>
    );
  }
}
