export type IDisplayDirection = 'h' | 'v';

export type IPanelSpanMap = {
  flex: {
    type: 'flex';
    spanPx?: number;
  };
  float: {
    type: 'float';
    top: number;
    left: number;
  };
};

export type IPanelSpan = IPanelSpanMap['flex'] | IPanelSpanMap['float'];

/** 基础面板 */
export type IBasePanel = {
  id: string;
  parentId?: string;
  order?: number;
};

export type IContainerPanel = IBasePanel & {
  /** **当前面板** 摆放 */
  span: IPanelSpan;

  /** 内容水平或垂直显示 */
  contentDirection: IDisplayDirection;
};

export type IPanelLike = IContainerPanel;

export type IContext = {
  panels: IPanelLike[];
  panelMap: {
    [id: string]: IPanelLike;
  };
  contentMap: {
    [id: string]: any;
  };
};

/** panel 组件 props */
export type IPanelProps = IContainerPanel & {
  /** 父 panel 配置（hoc 提供） */
  parent?: IContainerPanel;

  /** 兄弟 panel 配置（hoc 提供） */
  sibling?: IContainerPanel[];

  /** 子 panel 配置（hoc 提供） */
  kids?: IContainerPanel[];

  /** content（hoc 提供） */
  content?: any;
};
