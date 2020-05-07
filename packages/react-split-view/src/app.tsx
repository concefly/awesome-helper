import React from 'react';
import cx from 'classnames';
import { IPanelLike } from './interface';
import { calcPanelPxMap } from './util';
import { CLS_PREFIX, DEFAULT_COLLAPSE_PX } from './constant';

export type Props = {
  direction: 'v' | 'h';
  collapsePx?: number;
  defaultValue?: IPanelLike[];
  value?: IPanelLike[];
  style?: React.CSSProperties;
};

interface State {
  value: IPanelLike[];
  containerPx?: number;
  panelPxMap?: { [key: string]: number };
}

export class App extends React.PureComponent<Props, State> {
  private containerRef = React.createRef<HTMLDivElement>();

  state: State = {
    value: this.props.value || this.props.defaultValue || [],
  };

  static getDerivedStateFromProps(np: Props, state: State) {
    return { value: 'value' in np ? np.value : state.value } as State;
  }

  /** 重算容器尺寸 */
  private calcContainerPx(): number {
    const rect = this.containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;

    if (this.props.direction === 'v') return rect.height;
    if (this.props.direction === 'h') return rect.width;

    return 0;
  }

  componentDidMount() {
    const containerPx = this.calcContainerPx();
    const panelPxMap = calcPanelPxMap(containerPx, this.state.value);

    this.setState({ containerPx, panelPxMap });
  }

  /** 渲染面板 */
  renderPanel = (p: IPanelLike) => {
    const { direction } = this.props;
    const { panelPxMap } = this.state;

    const style: React.CSSProperties = {};

    // 生成占用 px 尺寸样式
    if (panelPxMap) {
      if (direction === 'h') style.width = panelPxMap[p.key];
      if (direction === 'v') style.height = panelPxMap[p.key];
    }

    // 生成折叠样式
    if (p.collapse) {
      if (direction === 'h') style.width = this.props.collapsePx || DEFAULT_COLLAPSE_PX;
      if (direction === 'v') style.height = this.props.collapsePx || DEFAULT_COLLAPSE_PX;

      style.overflow = 'hidden';
    }

    return (
      <section
        className={cx(`${CLS_PREFIX}-panel`, { collapse: p.collapse })}
        data-name={p.key}
        style={style}
      >
        {p.render(p)}
      </section>
    );
  };

  render() {
    const { style } = this.props;
    const { value } = this.state;

    return (
      <div className={cx(CLS_PREFIX)} ref={this.containerRef} style={style}>
        {value.map(this.renderPanel)}
      </div>
    );
  }
}
