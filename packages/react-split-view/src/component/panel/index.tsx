import React from 'react';
import { IPanelProps } from '../../interface';
import flowRight from 'lodash/flowRight';
import { withContext } from './hoc';
import cx from 'classnames';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import throttle from 'lodash/throttle';
import { CLS_PREFIX } from '../../constant';
import { isFlexSpan } from '../../util';

type IResizeHandleFlag = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

/** ResizeCallbackData 补全 */
interface ResizeCallbackDataX extends ResizeCallbackData {
  handle?: IResizeHandleFlag;
}

interface State {
  resizeBoxSpan: number;
  resizeData: ResizeCallbackDataX;
  isResizing: boolean;
}

export class PanelBase extends React.PureComponent<IPanelProps, State> {
  state: State = {
    resizeBoxSpan: null,
    resizeData: null,
    isResizing: false,
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
      const resizeBoxSpan = flowDirection === 'h' ? resizeData.size.width : resizeData.size.height;

      this.setState({ resizeBoxSpan, resizeData });
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

    const spanPx = this.state.resizeBoxSpan;

    ctx.setPanel(id, {
      ...data,
      span: {
        ...data.span,
        spanPx,
      } as any,
    });
  };

  renderContent() {
    const {
      data: { id },
      ctx,
    } = this.props;

    const kids = ctx.getKids(id);
    const content = ctx.getContent(id);

    if (kids.length) {
      return kids.map(kid => <Panel key={kid.id} data={kid} />);
    } else {
      return <div data-p-id={id}>{content}</div>;
    }
  }

  /** resize 时指引的 box */
  renderResizingBox() {
    const { data, ctx } = this.props;
    const { resizeBoxSpan, resizeData } = this.state;

    const flowDirection = ctx.getFlowDirection(data.id);

    let style: React.CSSProperties = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: flowDirection === 'h' && resizeBoxSpan,
      height: flowDirection === 'v' && resizeBoxSpan,
    };

    if (resizeData) {
      const { handle } = resizeData;

      if (handle.includes('w')) style.left = null;
      if (handle.includes('e')) style.right = null;
      if (handle.includes('n')) style.top = null;
      if (handle.includes('s')) style.bottom = null;
    }

    return <div className={`${CLS_PREFIX}-panel-resizeBox`} style={style} />;
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
      <div className={cls} style={style} data-p-id={data.id}>
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

export const Panel: React.ClassicComponentClass<IPanelProps> = flowRight([withContext])(PanelBase);
