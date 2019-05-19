import React from 'react';
import { IPanelProps, IContext } from '../../interface';
import flowRight from 'lodash/flowRight';
import { withContext } from './hoc';
import cx from 'classnames';
import { Resizable } from 'react-resizable';
import throttle from 'lodash/throttle';
import { CLS_PREFIX } from '../../constant';
import { isFlexSpan } from '../../util';

export class PanelBase extends React.PureComponent<IPanelProps> {
  handleResize = throttle(
    (ctx: IContext, spanPx: number) => {
      const { data } = this.props;
      const { id } = data;

      ctx.setPanel(id, {
        ...data,
        span: {
          ...data.span,
          spanPx,
        } as any,
      });
    },
    100,
    { leading: true }
  );

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

  getWrapperCls() {
    const { data } = this.props;

    let cls = cx(`${CLS_PREFIX}-panel`, `${CLS_PREFIX}-panel-${data.contentDirection}`);

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
          onResize={(_, _data) =>
            this.handleResize(ctx, flowDirection === 'h' ? _data.size.width : _data.size.height)
          }
        >
          {contentNode}
        </Resizable>
      );
    }

    return contentNode;
  }
}

export const Panel: React.ClassicComponentClass<IPanelProps> = flowRight([withContext])(PanelBase);
