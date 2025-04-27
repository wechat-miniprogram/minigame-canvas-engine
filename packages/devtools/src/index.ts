
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
// @ts-ignore
import App from './app.vue';

// PrimeVue style
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "./primeicons/primeicons.css";

// highlight.js init
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from "@highlightjs/vue-plugin";
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

class LayoutDevtools {
  // public Layout: any;
  private vueApp: any;

  constructor() {
    // 本地调试用
    if (process.env.NODE_ENV !== 'production') {
      const Layout: typeof import('minigame-canvas-engine').default = require('minigame-canvas-engine').default;

      (window as any).Layout = Layout;
    }

    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.prepend(appDiv);

    const vueApp = createApp(App, { Layout: (window as any).Layout }).use(PrimeVue).use(hljsVuePlugin).mount('#app');
    this.vueApp = vueApp;
  }

  init(Layout) {
    this.vueApp.initLayout(Layout);
  }
}

(window as any).layoutDevtools = new LayoutDevtools();

export default (window as any).layoutDevtools;
