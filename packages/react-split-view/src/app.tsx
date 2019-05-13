import React from 'react';
import cx from 'classnames';

export interface Props {
  className?: string;
}

export const App = ({ className, ...props }: Props) => (
  <div className={cx('App', className)} {...props}>
    app
  </div>
);
