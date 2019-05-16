import React from 'react';
import { IPanelProps, IContext } from '../../interface';
import { Context } from '../provider';
import { isFlexSpan } from '../../util';
import cx from 'classnames';
import { Resizable } from 'react-resizable';
import throttle from 'lodash/throttle';
import { CLS_PREFIX } from '../../constant';

/** 处理布局 */
export function withLayout<C extends any>(Comp: C): C {
  const NewComp = (p: IPanelProps) => (
    <Context.Consumer>
      {ctx => {
        const { data } = p;
        const parent = ctx.panelMap[data.parentId];

        let cls = cx(`${CLS_PREFIX}-panel`, `${CLS_PREFIX}-panel-${data.contentDirection}`);
        let style: React.CSSProperties = {};

        if (isFlexSpan(data.span)) {
          const shouldGrow = !data.span.spanPx;

          cls = cx(cls, {
            [`${CLS_PREFIX}-panel-grow`]: shouldGrow,
          });

          if (parent && data.span.spanPx) {
            switch (parent.contentDirection) {
              case 'h':
                style.width = data.span.spanPx;
                break;
              case 'v':
                style.height = data.span.spanPx;
                break;
              default:
                break;
            }
          }
        }
        return (
          <div className={cls} style={style} data-p-id={data.id}>
            <Comp {...p} />
          </div>
        );
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

export function withContext<C extends any>(Comp: C): C {
  const NewComp = (p: IPanelProps) => (
    <Context.Consumer>
      {ctx => {
        return <Comp {...p} ctx={ctx} />;
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

export function withResize<C extends any>(Comp: C): C {
  require('react-resizable/css/styles.css');

  const NewComp = class extends React.PureComponent<IPanelProps> {
    state = {
      width: null,
      height: null,
    };

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

    render() {
      const { data } = this.props;
      const { id, span } = data;

      // 有 spanPx 才可 resize
      if (isFlexSpan(span) && span.spanPx) {
        return (
          <Context.Consumer>
            {ctx => {
              const flowDirection = ctx.getFlowDirection(id);
              const isFlowStart = ctx.isFlowStart(id);
              const isFlowEnd = ctx.isFlowEnd(id);

              const width = flowDirection === 'h' ? span.spanPx : 0;
              const height = flowDirection === 'v' ? span.spanPx : 0;
              const axis = flowDirection === 'h' ? 'x' : 'y';

              const resizeHandles = cx({
                s: flowDirection === 'v' && !isFlowEnd,
                n: flowDirection === 'v' && !isFlowStart,
                e: flowDirection === 'h' && !isFlowEnd,
                w: flowDirection === 'h' && !isFlowStart,
              }).split(' ');

              return (
                <Resizable
                  width={width}
                  height={height}
                  axis={axis}
                  resizeHandles={resizeHandles}
                  onResize={(_, _data) =>
                    this.handleResize(
                      ctx,
                      flowDirection === 'h' ? _data.size.width : _data.size.height
                    )
                  }
                >
                  <div>
                    <Comp {...this.props} />
                  </div>
                </Resizable>
              );
            }}
          </Context.Consumer>
        );
      }

      return <Comp {...this.props} />;
    }
  };

  return NewComp as any;
}
