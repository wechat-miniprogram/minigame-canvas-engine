
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Test from './ui.vue';

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
  public Layout: any;
  private vueApp: any;

  constructor() {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.prepend(appDiv);

    const vueApp = createApp(Test).use(PrimeVue).use(hljsVuePlugin).mount('#app');

    if (process.env.NODE_ENV !== 'production') {
      //@ts-ignore
      const Layout = require('minigame-canvas-engine').default;
      //@ts-ignore
      vueApp.initLayout(Layout);

      window.Layout = Layout;

      require('./layoutTest');
    }

    this.vueApp = vueApp;
  }

  init(Layout: any) {
    this.vueApp.initLayout(Layout);
  }
}

window.layoutDevtools = new LayoutDevtools();

export default window.layoutDevtools;
