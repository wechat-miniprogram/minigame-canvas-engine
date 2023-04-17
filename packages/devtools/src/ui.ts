import { createApp } from 'vue';
import Test from './test.vue'

export default class UI {
  constructor() {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    appDiv.className = 'xxx'
    document.body.appendChild(appDiv);

    createApp(Test).mount('#app');
  }
}
