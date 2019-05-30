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
    hideIfEmpty: true,
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
  <div>
    <App
      defaultValue={panels}
      style={{ height: 200, width: '80vw' }}
      panelStyle={{
        border: '1px dashed #ccc',
      }}
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
    </App>

    <section title='hideIfEmpty(所有面板都要隐藏)'>
      <h1>hideIfEmpty(所有面板都要隐藏)</h1>
      <div>
        <App
          value={[
            {
              id: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
              hideIfEmpty: true,
            },
            {
              id: 'a',
              parentId: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'b',
              parentId: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'c',
              parentId: 'b',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
          ]}
          style={{ height: 40, width: 400, border: '1px solid #000' }}
          panelStyle={{
            border: '1px dashed #ccc',
          }}
        />
      </div>
    </section>

    <section title='自定义 resize handler'>
      <h1>自定义 resize handler</h1>
      <div>
        <App
          defaultValue={[
            {
              id: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'a',
              parentId: 'root',
              span: { type: 'flex', spanPx: 100 },
              contentDirection: 'h' as any,
            },
            {
              id: 'b',
              parentId: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'c',
              parentId: 'root',
              span: { type: 'flex', spanPx: 100 },
              contentDirection: 'h' as any,
            },
          ]}
          style={{ height: 40, width: 400, border: '1px solid #000' }}
          panelStyle={{
            border: '1px dashed #ccc',
          }}
          resizeHandleBar={flag => (
            <span
              style={{
                position: 'absolute',
                ...(flag === 'e' && {
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: 10,
                  cursor: 'ew-resize',
                }),
                ...(flag === 'w' && {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: 10,
                  cursor: 'ew-resize',
                }),
              }}
            />
          )}
        />
      </div>
    </section>

    <section title='隐藏模块'>
      <h1>隐藏模块</h1>
      <div>
        <App
          defaultValue={[
            {
              id: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'a',
              parentId: 'root',
              span: { type: 'flex', spanPx: 100 },
              contentDirection: 'h' as any,
              hide: true,
            },
          ]}
          style={{ height: 40, width: 400, border: '1px solid #000' }}
          panelStyle={{
            border: '1px dashed #ccc',
          }}
        />
      </div>
    </section>

    <section title='折叠模块'>
      <h1>折叠模块</h1>
      <div>
        <App
          defaultValue={[
            {
              id: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
            {
              id: 'a',
              parentId: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
              collapse: true,
            },
            {
              id: 'b',
              parentId: 'root',
              span: { type: 'flex' },
              contentDirection: 'h' as any,
            },
          ]}
          collapsePx={20}
          style={{ height: 40, width: 400, border: '1px solid #000' }}
          panelStyle={{
            border: '1px dashed #ccc',
          }}
        >
          <Content
            id='a'
            render={({ ctx, data }) => (
              <button
                onClick={() => {
                  ctx.setPanel(data.id, {
                    ...data,
                    collapse: !data.collapse,
                  });
                }}
              >
                a
              </button>
            )}
          />
        </App>
      </div>
    </section>
  </div>,
  document.getElementById('root')
);
