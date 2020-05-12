import React from 'react';
import ReactDom from 'react-dom';
import App, { IAppProps } from '../src';

import '../src/style';

const list: (IAppProps & {
  title: string;
})[] = [
  {
    title: 'normal',
    direction: 'v',
    defaultValue: [
      {
        key: '1',
        span: { type: 'flow' as any, spanPercent: 20 },
        collapse: false,
        render: () => 'a',
      },
      {
        key: '2',
        span: { type: 'flow' as any, spanPercent: 80 },
        collapse: false,
        render: () => 'b',
      },
    ],
    style: { height: 100 },
  },
  {
    title: '折叠',
    direction: 'h',
    defaultValue: [
      {
        key: '1',
        span: { type: 'flow' as any, spanPercent: 100 },
        collapse: false,
        render: () => '1',
      },
      {
        key: '2',
        span: { type: 'flow' as any, spanPercent: 100 },
        collapse: true,
        render: () => '2222222',
      },
      {
        key: '3',
        span: { type: 'flow' as any, spanPercent: 100 },
        collapse: false,
        render: () => '3',
      },
      {
        key: '4',
        span: { type: 'flow' as any, spanPercent: 100 },
        collapse: true,
        render: () => '444444444',
      },
    ],
    style: { width: 400 },
  },
  {
    title: '尾折叠收到下面',
    direction: 'v',
    defaultValue: [
      {
        key: '1',
        span: { type: 'flow' as any, spanPercent: 50 },
        collapse: false,
        render: () => '11111',
      },
      {
        key: '2',
        span: { type: 'flow' as any, spanPercent: 50 },
        collapse: true,
        render: () => '22222',
      },
    ],
    style: { height: 200 },
  },
];

ReactDom.render(
  <div>
    <style>
      {`.RSV {
        background: rgba(0,0,0,.1);
      }
      .RSV-panel {
        border: 1px solid #000;
      }`}
    </style>
    {list.map(({ title, ...props }) => (
      <section key={title}>
        <h1>{title}</h1>
        <App {...props}></App>
      </section>
    ))}
  </div>,
  document.getElementById('root')
);
