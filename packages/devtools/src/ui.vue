<script lang="ts">
import { template, templateSettings } from 'dot';
const beautify = require('js-beautify').js;

export default {
  data() {
    return {
      count: 0
    }
  },

  methods: {
    doTCompile() {
      let comment =
        `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;

      let xml = `
        <view id="container">
        <view class="ball"></view>
      </view>
      `;

      const tplFunc = String(template(xml, Object.assign(templateSettings, {
        varname: 'data',
      })));

      const beautifyFunc = beautify(tplFunc);

      const res = `${comment}export default ${beautifyFunc}`.replace('export default function anonymous', 'export default function tplFunc');

      console.log(res)
    }
  }
}
</script>

<template>
  <button @click="doTCompile">doT</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>