
import { createApp } from 'vue';
import Test from './ui.vue';

class App {
  constructor() {
    this.init();
  }

  init() {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);

    createApp(Test).mount('#app');
  }
}

new App();
