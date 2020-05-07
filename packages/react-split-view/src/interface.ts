export type IPanelSpanMap = {
  /** 流式布局 */
  flow: {
    type: 'flow';
    /** 占据百分比 [0,100] */
    spanPercent: number;
  };
};

export type IPanelSpan = IPanelSpanMap['flow'];

/** 基础面板 */
export type IPanelLike<T extends any = {}> = {
  key: string;

  /** **当前面板** 摆放 */
  span: IPanelSpan;

  /** 折叠此节点 */
  collapse: boolean;

  /** 面板渲染函数 */
  render: (p: IPanelLike) => any;
} & T;
