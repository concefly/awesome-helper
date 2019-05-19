export type IDisplayDirection = 'h' | 'v';

export type IPanelSpanMap = {
  flex: {
    type: 'flex';
    spanPx?: number;

    /** 是否收起 */
    collapsed?: boolean;
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

  setPanel: (id: string, p: IPanelLike) => void;

  setPanelRuntimeMeta: (id: string, meta: IPanelRuntimeMeta) => void;
};

export type IPanelProps = {
  data: IContainerPanel;

  /** hoc 提供 */
  ctx?: IContext;
};

export type IPanelRuntimeMeta = {
  rect: ClientRect;
};
