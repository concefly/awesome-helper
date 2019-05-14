import React from 'react';
import { IContainerPanel } from '../../interface';
import { Context } from '../provider';
import { isFlexSpan } from '../../util';
import cx from 'classnames';

/** 处理布局 */
export function withLayout<C extends any>(Comp: C): C {
  const NewComp = (p: IContainerPanel) => (
    <Context.Consumer>
      {ctx => {
        const parent = ctx.panelMap[p.parentId];

        let cls = cx('P-panel', `P-panel-${p.contentDirection}`);
        let style: React.CSSProperties = {};

        if (isFlexSpan(p.span)) {
          const shouldGrow = !p.span.spanPx;

          cls = cx(cls, {
            'P-panel-grow': shouldGrow,
          });

          if (parent && p.span.spanPx) {
            switch (parent.contentDirection) {
              case 'h':
                style.width = p.span.spanPx;
                break;
              case 'v':
                style.height = p.span.spanPx;
                break;
              default:
                break;
            }
          }
        }
        return (
          <div className={cls} style={style} data-p-id={p.id}>
            <Comp {...p} />
          </div>
        );
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

/** 注入 parent */
export function withParent<C extends any>(Comp: C): C {
  const NewComp = (p: IContainerPanel) => (
    <Context.Consumer>
      {ctx => {
        const parent = ctx.panelMap[p.parentId];
        return <Comp {...p} parent={parent} />;
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

/** 注入 sibling */
export function withSibling<C extends any>(Comp: C): C {
  const NewComp = (p: IContainerPanel) => (
    <Context.Consumer>
      {ctx => {
        const sibling = ctx.panels.filter(
          child => child.parentId === p.parentId && child.id !== p.id
        );
        return <Comp {...p} sibling={sibling} />;
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

/** 注入 kids */
export function withKids<C extends any>(Comp: C): C {
  const NewComp = (p: IContainerPanel) => (
    <Context.Consumer>
      {ctx => {
        const kids = ctx.panels.filter(child => child.parentId === p.id);
        return <Comp {...p} kids={kids} />;
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}

export function withContent<C extends any>(Comp: C): C {
  const NewComp = (p: IContainerPanel) => (
    <Context.Consumer>
      {ctx => {
        const content = ctx.contentMap[p.id] || <i>{p.id}</i>;

        return <Comp {...p} content={content} />;
      }}
    </Context.Consumer>
  );

  return NewComp as any;
}
