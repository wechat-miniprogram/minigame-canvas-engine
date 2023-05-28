declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

import LayoutClass from 'minigame-canvas-engine';
interface Window {
  layoutDevtools: any;
  Layout: typeof LayoutClass;
}


