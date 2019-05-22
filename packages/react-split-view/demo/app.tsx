import React from 'react';
import ReactDom from 'react-dom';
import App, { Content } from '../src';
import { IPanelLike } from '../src/interface';

import '../src/style';

const panels: IPanelLike[] = [
  {
    id: 'root',
    span: { type: 'flex' },
    contentDirection: 'h' as any,
  },
  // #1
  {
    id: 'left',
    parentId: 'root',
    span: { type: 'flex', spanPx: 200 },
    contentDirection: 'v',
  },
  {
    id: 'center',
    parentId: 'root',
    span: { type: 'flex' },
    contentDirection: 'v',
  },
  {
    id: 'center-2',
    parentId: 'root',
    span: { type: 'flex' },
    contentDirection: 'v',
  },
  {
    id: 'right',
    parentId: 'root',
    span: { type: 'flex', spanPx: 200 },
    contentDirection: 'h',
  },

  // 第二层
  {
    id: 'left-top',
    parentId: 'left',
    span: { type: 'flex', spanPx: 100 },
    contentDirection: 'v',
  },
  {
    id: 'left-middle',
    parentId: 'left',
    span: { type: 'flex' },
    contentDirection: 'v',
  },
  {
    id: 'left-bottom',
    parentId: 'left',
    span: { type: 'flex', spanPx: 100 },
    contentDirection: 'v',
  },

  // center-2
  {
    id: 'center-2-top',
    parentId: 'center-2',
    span: { type: 'flex', spanPx: 50, disableResize: true },
    contentDirection: 'v',
  },
  {
    id: 'center-2-middle',
    parentId: 'center-2',
    span: { type: 'flex' },
    contentDirection: 'v',
  },
  {
    id: 'center-2-bottom',
    parentId: 'center-2',
    span: { type: 'flex' },
    contentDirection: 'v',
  },
];

ReactDom.render(
  <App
    defaultValue={panels}
    style={{ height: 300, width: '80vw' }}
    onChange={data => {
      console.log('@@@', 'data ->', data);
      window.localStorage.setItem('_layout', JSON.stringify(data));
    }}
  >
    {Object.assign(() => 'LEFT-TOP', {
      key: 'left-top',
    })}
    <Content
      id='center'
      render={({ data }) => <div style={{ width: '100vw' }}>Content render: {data.id}</div>}
    />
    <div key='right' style={{ height: '400px' }}>
      BBB
    </div>
    <div key='center-2-top'>disableResize = true</div>
  </App>,
  document.getElementById('root')
);
