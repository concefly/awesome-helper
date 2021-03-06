import React from 'react';
import cx from 'classnames';
import { IPanelLike } from './interface';
import { CLS_PREFIX, DEFAULT_COLLAPSE_PX } from './constant';

export type Props = {
  direction: 'v' | 'h';
  className?: string;
  collapsePx?: number;
  defaultValue?: IPanelLike[];
  value?: IPanelLike[];
  style?: React.CSSProperties;
};

interface State {
  value: IPanelLike[];
}

export class App extends React.PureComponent<Props, State> {
  private containerRef = React.createRef<HTMLDivElement>();

  state: State = {
    value: this.props.value || this.props.defaultValue || [],
  };

  static getDerivedStateFromProps(np: Props, state: State) {
    return { value: 'value' in np ? np.value : state.value } as State;
  }

  private get collapsePx() {
    return this.props.collapsePx || DEFAULT_COLLAPSE_PX;
  }

  /** 渲染面板 */
  renderPanel(
    p: IPanelLike,
    /** 折叠总尺寸 */
    collapseTotalPx: number,
    /** 未折叠总尺寸 */
    unCollapseTotalSpan: number
  ) {
    const { direction } = this.props;

    const style: React.CSSProperties = {};

    // 生成占用 px 尺寸样式
    const size = `calc((100% - ${collapseTotalPx}px) * ${
      p.span.spanPercent / unCollapseTotalSpan
    })`;

    if (direction === 'h') style.width = size;
    if (direction === 'v') style.height = size;

    // 生成折叠样式
    if (p.collapse) {
      if (direction === 'h') style.width = this.collapsePx;
      if (direction === 'v') style.height = this.collapsePx;
    }

    return (
      <section
        key={p.key}
        className={cx(`${CLS_PREFIX}-panel`, { collapse: p.collapse })}
        data-name={p.key}
        style={style}
      >
        {p.render(p)}
      </section>
    );
  }

  render() {
    const { className, style, direction } = this.props;
    const { value } = this.state;

    let collapseTotalPx = 0;
    let unCollapseTotalSpan = 0;

    value.forEach(v => {
      if (v.collapse) collapseTotalPx += this.collapsePx;
      else unCollapseTotalSpan += v.span.spanPercent;
    });

    return (
      <div
        className={cx(CLS_PREFIX, className, {
          ['direction-v']: direction === 'v',
          ['direction-h']: direction === 'h',
        })}
        ref={this.containerRef}
        style={style}
      >
        {value.map(p => this.renderPanel(p, collapseTotalPx, unCollapseTotalSpan))}
      </div>
    );
  }
}
