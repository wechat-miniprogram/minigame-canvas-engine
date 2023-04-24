declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

interface Window {
  Layout: any;
  layoutDevtools: any;
}
