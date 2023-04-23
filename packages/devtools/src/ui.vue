<script lang="ts">
import { template, templateSettings } from 'dot';
const beautify = require('js-beautify').js;
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';

import { clipboard, xmlDemo } from './util';

interface CoptMessage {
  id: number
  content: string
  severity: string
}

export default {
  data() {
    return {
      visible: false,
      showNoXMLDialog: false,
      code: '',
      messages: [] as CoptMessage[],
      xmlDemo,
    }
  },

  components: {
    Button,
    Dialog,
    Message,
  },

  methods: {
    doTCompile() {
      let xml = document.getElementById('template')?.innerHTML;

      // 没有监听到模板的情况
      if (!xml) {
        this.showNoXMLDialog = true;
        return;
      }

      let comment =
        `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;

      const tplFunc = String(template(xml, Object.assign(templateSettings, {
        varname: 'data',
      })));

      const beautifyFunc = beautify(tplFunc, { indent_size: 2 });

      this.code = `${comment}export default ${beautifyFunc}`.replace('export default function anonymous', 'export default function tplFunc');
      this.visible = true;
    },

    copyCode() {
      clipboard(this.code);
      this.messages = [
        { severity: 'success', content: '已拷贝到剪切板', id: Math.random() },
      ] as CoptMessage[];
    },

    hideDialog() {
      this.message = [];
    }
  }
}
</script>

<template>
  <!-- <Button click="doT Compile">doT</Button> -->
  <Button @click="doTCompile" label="doT编译" severity="success" size="small" />
  <Dialog @hide="hideDialog" v-model:visible="visible" modal header="模板函数" :style="{ width: '50vw' }">
    <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>

    <highlightjs language='javascript' :code="code" />

    <Button @click="copyCode" label="复制到剪切板" severity="success" size="small" />
  </Dialog>

  <Dialog v-model:visible="showNoXMLDialog" modal header="模板示意" :style="{ width: '50vw' }">
    <Message :closable="false">没有监听到模板，请参照下面的格式在html内注入模板</Message>

    <highlightjs language='xml' :code="xmlDemo" />
  </Dialog>
</template>

<style scoped>
html {
  font-size: 14px;
}

body {
  font-family: (--font-family);
  font-size: 14px;
}
</style>