
import { createApp } from 'vue';
import Test from './ui.vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

class App {
  constructor() {
    this.init();
  }

  init() {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);

    createApp(Test).use(vuetify).mount('#app');
  }
}

new App();
