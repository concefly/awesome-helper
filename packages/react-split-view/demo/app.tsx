import React from 'react';
import ReactDom from 'react-dom';
import App from '../src';
import { IPanelLike } from '../src/interface';

const panels: IPanelLike[] = JSON.parse(window.localStorage.getItem('_layout')) || [
  {
    id: 'root',
    span: { type: 'flex' } as any,
    contentDirection: 'h' as any,
  },
  {
    id: 'left',
    parentId: 'root',
    span: { type: 'flex', spanPx: 200 } as any,
    contentDirection: 'v',
  },
  {
    id: 'center',
    parentId: 'root',
    span: { type: 'flex' } as any,
    contentDirection: 'v',
  },
  {
    id: 'right',
    parentId: 'root',
    span: { type: 'flex', spanPx: 200 } as any,
    contentDirection: 'h',
  },

  // // 第二层
  {
    id: 'left-top',
    parentId: 'left',
    span: { type: 'flex', spanPx: 200 } as any,
    contentDirection: 'v',
  },
  {
    id: 'left-middle',
    parentId: 'left',
    span: { type: 'flex' } as any,
    contentDirection: 'v',
  },
  {
    id: 'left-bottom',
    parentId: 'left',
    span: { type: 'flex' } as any,
    contentDirection: 'v',
  },
];

ReactDom.render(
  <App
    panels={panels}
    root='root'
    style={{ height: 600 }}
    onChange={data => {
      window.localStorage.setItem('_layout', JSON.stringify(data));
    }}
  >
    <div key='center'>AAA</div>
    <div key='right'>BBB</div>
  </App>,
  document.getElementById('root')
);
