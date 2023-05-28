import LayoutClass from 'minigame-canvas-engine';

declare global {
  const __env: any;
  export type Layout = typeof LayoutClass
}
