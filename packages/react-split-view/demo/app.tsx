import React from 'react';
import ReactDom from 'react-dom';
import App from '../src';

import '../src/style';

ReactDom.render(
  <div>
    <style>
      {`.RSV-panel {
        border: 1px solid #000
      }`}
    </style>
    <App
      direction='v'
      defaultValue={[
        {
          key: '1',
          span: { type: 'flow' as any, spanPercent: 20 },
          collapse: false,
          render: () => 'a',
        },
        {
          key: '2',
          span: { type: 'flow' as any, spanPercent: 80 },
          collapse: true,
          render: () => 'b',
        },
      ]}
      style={{ height: 100 }}
    ></App>
  </div>,
  document.getElementById('root')
);
