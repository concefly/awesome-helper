import React from 'react';
import { IPanelProps } from '../../interface';
import flowRight from 'lodash/flowRight';
import sum from 'lodash/sum';
import { withContext, withData } from './hoc';
import cx from 'classnames';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import throttle from 'lodash/throttle';
import { CLS_PREFIX } from '../../constant';
import { isFlexSpan, makeDomProps } from '../../util';

type IResizeHandleFlag = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

/** ResizeCallbackData 补全 */
interface ResizeCallbackDataX extends ResizeCallbackData {
  handle?: IResizeHandleFlag;
}

interface State {
  resizingBoxSpan: number;
  resizeData: ResizeCallbackDataX;
  isResizing: boolean;
}

export class PanelBase extends React.PureComponent<IPanelProps, State> {
  state: State = {
    resizingBoxSpan: null,
    resizeData: null,
    isResizing: false,
  };

  panelDivRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.syncPanelRuntimeMeta();
  }

  componentDidUpdate() {
    this.syncPanelRuntimeMeta();
  }

  syncPanelRuntimeMeta = () => {
    const { ctx, data } = this.props;

    ctx.setPanelRuntimeMeta(data.id, {
      ...ctx.getPanelRuntimeMeta(data.id),
      rect: this.panelDivRef.current.getBoundingClientRect(),
    });
  };

  handleResizeStart = (resizeData: ResizeCallbackDataX) => {
    this.setState({ resizeData, isResizing: true });
  };

  /** resize 过程中 */
  handleResize = throttle(
    (resizeData: ResizeCallbackDataX) => {
      const { data, ctx } = this.props;
      const { id } = data;

      const flowDirection = ctx.getFlowDirection(id);
      const resizingBoxSpan =
        flowDirection === 'h' ? resizeData.size.width : resizeData.size.height;

      const siblings = ctx.getSiblings(id);

      const { rect: parentRect } = ctx.getPanelRuntimeMeta(data.parentId);

      const parentSpan = flowDirection === 'h' ? parentRect.width : parentRect.height;

      const currentTotalSpan = sum([
        ...siblings.map(s => {
          if (isFlexSpan(s.span)) return s.span.spanPx;
          return 0;
        }),
        resizingBoxSpan,
      ]);

      if (currentTotalSpan > parentSpan) return;

      this.setState({ resizingBoxSpan, resizeData });
    },
    20,
    {
      leading: true,
    }
  );

  /** resize 结束 */
  handleResizeStop = (resizeData: ResizeCallbackDataX) => {
    const { data, ctx } = this.props;
    const { id } = data;

    this.setState({ resizeData, isResizing: false });

    const { resizingBoxSpan } = this.state;

    // 在 resize 开始的一瞬间，resizingBoxSpan 是空的，不用 setPanel
    if (!resizingBoxSpan) return;

    ctx.setPanel(id, {
      ...data,
      span: {
        ...data.span,
        spanPx: resizingBoxSpan,
      } as any,
    });
  };

  renderContent() {
    const { data, ctx } = this.props;

    const kids = ctx.getKids(data.id);
    const content = ctx.getContent(data.id);

    if (kids.length) {
      return kids.map(kid => <Panel key={kid.id} id={kid.id} />);
    } else {
      return content;
    }
  }

  /** resize 时指引的 box */
  renderResizingBox() {
    const { data, ctx } = this.props;
    const { resizingBoxSpan, resizeData } = this.state;

    const flowDirection = ctx.getFlowDirection(data.id);

    let style: React.CSSProperties = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: flowDirection === 'h' && resizingBoxSpan,
      height: flowDirection === 'v' && resizingBoxSpan,
      ...ctx.getStyle(data.id).resizingBox,
    };

    // 在 resize 开始的一瞬间，resizingBoxSpan 是空的，不能删除 top left 等定位属性
    if (resizeData && resizingBoxSpan) {
      const { handle } = resizeData;

      if (handle.includes('w')) style.left = null;
      if (handle.includes('e')) style.right = null;
      if (handle.includes('n')) style.top = null;
      if (handle.includes('s')) style.bottom = null;
    }

    return <div className={`${CLS_PREFIX}-panel-resizingBox`} style={style} />;
  }

  getWrapperCls() {
    const { data } = this.props;
    const { isResizing } = this.state;

    let cls = cx(`${CLS_PREFIX}-panel`, `${CLS_PREFIX}-panel-${data.contentDirection}`, {
      [`${CLS_PREFIX}-panel-resizing`]: isResizing,
    });

    if (isFlexSpan(data.span)) {
      const shouldGrow = !data.span.spanPx;

      cls = cx(cls, {
        [`${CLS_PREFIX}-panel-grow`]: shouldGrow,
      });
    }

    return cls;
  }

  getWrapperStyle() {
    const { data, ctx } = this.props;
    const parent = ctx.getParent(data.id);

    let style: React.CSSProperties = {};

    if (isFlexSpan(data.span)) {
      if (parent && data.span.spanPx) {
        switch (parent.contentDirection) {
          case 'h':
            style.width = data.span.collapsed ? 0 : data.span.spanPx;
            break;
          case 'v':
            style.height = data.span.collapsed ? 0 : data.span.spanPx;
            break;
          default:
            break;
        }
      }
    }

    return style;
  }

  render() {
    const { data, ctx } = this.props;

    const cls = this.getWrapperCls();
    const style = this.getWrapperStyle();

    const contentNode = (
      <div {...makeDomProps(data)} className={cls} style={style} ref={this.panelDivRef}>
        {this.renderContent()}
        {this.renderResizingBox()}
      </div>
    );

    const isFlowStart = ctx.isFlowStart(data.id);
    const isFlowEnd = ctx.isFlowEnd(data.id);

    if (isFlexSpan(data.span) && data.span.spanPx && !(isFlowStart && isFlowEnd)) {
      const flowDirection = ctx.getFlowDirection(data.id);

      const width = flowDirection === 'h' && data.span.spanPx;
      const height = flowDirection === 'v' && data.span.spanPx;
      const axis = flowDirection === 'h' ? 'x' : 'y';

      const resizeHandles = cx({
        s: flowDirection === 'v' && !isFlowEnd,
        n: flowDirection === 'v' && !isFlowStart,
        e: flowDirection === 'h' && !isFlowEnd,
        w: flowDirection === 'h' && !isFlowStart,
      }).split(' ');

      return (
        <Resizable
          // workaround: ts error
          {...{} as any}
          width={width || 0}
          height={height || 0}
          axis={axis}
          resizeHandles={resizeHandles}
          onResize={(_, _data) => this.handleResize(_data)}
          onResizeStart={(_, _data) => this.handleResizeStart(_data)}
          onResizeStop={(_, _data) => this.handleResizeStop(_data)}
        >
          {contentNode}
        </Resizable>
      );
    }

    return contentNode;
  }
}

export const Panel: React.ClassicComponentClass<IPanelProps> = flowRight([withData, withContext])(
  PanelBase
);
