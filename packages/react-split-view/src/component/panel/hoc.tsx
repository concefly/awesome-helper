import React from 'react';
import { IPanelProps } from '../../interface';
import { Context } from '../provider';

/** 注入 ctx */
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
