
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Test from './ui.vue';

// PrimeVue style
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "./primeicons/primeicons.css";

import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

class App {
  constructor() {
    this.init();
  }

  init() {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.prepend(appDiv);

    createApp(Test).use(PrimeVue).use(hljsVuePlugin).mount('#app');
  }
}

new App();
