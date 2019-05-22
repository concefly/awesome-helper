export type IDisplayDirection = 'h' | 'v';

export type IPanelSpanMap = {
  flex: {
    type: 'flex';
    spanPx?: number;

    /** 禁用 resize */
    disableResize?: boolean;
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
};

export type IContainerPanel = IBasePanel & {
  // 允许用户自定义挂一些数据
  [prop: string]: any;

  /** **当前面板** 摆放 */
  span: IPanelSpan;

  /** 内容水平或垂直显示 */
  contentDirection: IDisplayDirection;

  hideIfEmpty?: boolean;
};

export type IPanelLike = IContainerPanel;

export type IContext = {
  getPanel: (id: string) => IPanelLike;

  getParent: (id: string) => IPanelLike;
  getKids: (id: string) => IPanelLike[];

  getSiblings: (id: string) => IPanelLike[];
  getAllSiblings: (id: string) => IPanelLike[];
  getSiblingIndex: (id: string) => number;

  getFlowDirection: (id: string) => IDisplayDirection;
  /** 排第一 */
  isFlowStart: (id: string) => boolean;
  /** 排末尾 */
  isFlowEnd: (id: string) => boolean;

  getPanelRuntimeMeta: (id: string) => IPanelRuntimeMeta;

  getContent: (id: string) => any;

  getStyle: (id: string) => { resizingBox?: React.CSSProperties; panel?: React.CSSProperties };
  getAppProps: () => IAppProps;

  setPanel: (id: string, p: IPanelLike) => void;

  setPanelRuntimeMeta: (id: string, meta: IPanelRuntimeMeta) => void;
};

/**
 * Panel props
 *
 * 大部分 Props 都从 ctx 上取即可
 */
export type IPanelProps = {
  id: string;

  /** hoc 提供 */
  data?: IContainerPanel;
  ctx?: IContext;
};

export type IPanelRuntimeMeta = {
  rect: ClientRect;
};

export type IContentProps = {
  id: string;
  render: (opt: { ctx: IContext; data: IPanelLike }) => any;
};

export interface IAppProps {
  root: string;
  defaultValue?: IContainerPanel[];
  value?: IContainerPanel[];
  onChange?: (value: IContainerPanel[]) => void;
  style?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
  resizingBoxStyle?: React.CSSProperties;
}
