import React from 'react';
import { IContentProps } from '../../interface';
import { Context } from '../provider';

export class Content extends React.Component<IContentProps> {
  render() {
    const { render, id } = this.props;

    return (
      <Context.Consumer>
        {ctx => {
          const data = ctx.getPanel(id);

          return render({ ctx, data });
        }}
      </Context.Consumer>
    );
  }
}
