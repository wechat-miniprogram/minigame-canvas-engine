export type IDataset = Record<string, any>;

export type Callback = (...args: any[]) => void;

export interface GameTouch {
  timeStamp: number;
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  force?: number;
}

export interface GameTouchEvent {
  type: string;
  timeStamp: number;
  touches: GameTouch[];
  changedTouches: GameTouch[];
}

export interface TreeNode {
  name: string;
  attr: Record<string, string>;
  children: TreeNode[];
}