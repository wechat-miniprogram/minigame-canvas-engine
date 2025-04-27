<script lang="ts">
const Stats = require("stats.js");
const beautify = require("js-beautify").js;

import { template } from "dot";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Message from "primevue/message";

import { clipboard, xmlDemo, devtoolsNotInitCode } from "./util";
import { defineComponent } from "vue";
import { defineAsyncComponent } from 'vue';

interface CoptMessage {
  id: number;
  content: string;
  severity: string;
}

// @ts-ignore
// import Demos from './demos/index';

export default defineComponent({
  data() {
    return {
      visible: false,
      showNoXMLDialog: false,
      showDevToolsNotInit: false,
      code: "",
      messages: [] as CoptMessage[],
      xmlDemo,
      devtoolsNotInitCode,
      statShow: false,
      stats: null,
      statTicker: null,
      demoComponent: null
    };
  },

  created() {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'production') {
      this.demoComponent = defineAsyncComponent(() =>
        // @ts-ignore
        import('./demos/index')
      );
    }
  },

  mounted() {
    document.documentElement.style.fontSize = "14px";
  },

  components: {
    Button,
    Dialog,
    Message,
  },

  methods: {
    initLayout(Layout: any) {
      this.Layout = Layout;
    },

    doTCompile() {
      let xml = document.getElementById("template")?.innerHTML;

      if (process.env.NODE_ENV !== 'production') {
        xml = (window as any).layoutTpl;
      }

      // 没有监听到模板的情况
      if (!xml) {
        this.showNoXMLDialog = true;
        return;
      }

      let comment = 
  `
/**
 * 模板引擎使用教程可见：https://wechat-miniprogram.github.io/minigame-canvas-engine/tutorial/templateengine.html
 * xml经过doT.js编译出的模板函数
 * 因为小游戏不支持new Function，模板函数只能外部编译
 * 可直接拷贝本函数到小游戏中使用
 * 原始的模板如下：
 * ${xml}
 * 
 */
`;

      const tplFunc = String(template(xml));

      const beautifyFunc = beautify(tplFunc, { indent_size: 2 });

      this.code = `${comment}export default ${beautifyFunc}`.replace(
        "export default function anonymous",
        "export default function tplFunc"
      );
      this.visible = true;
    },

    copyCode() {
      clipboard(this.code);
      this.messages = [
        { severity: "success", content: "已拷贝到剪切板", id: Math.random() },
      ] as CoptMessage[];
    },

    hideDialog() {
      this.message = [];
    },

    goToDoc() {
      window.open(
        "https://wechat-miniprogram.github.io/minigame-canvas-engine/"
      );
    },

    goToDemos() {
      window.open("https://codepen.io/collection/PYrdpO?grid_type=grid");
    },

    toggleStat() {
      if (!this.detectDevtoolsInit()) {
        return;
      }

      if (!this.stats) {
        const stats = new Stats();
        this.stats = stats;
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.$refs.container.appendChild(stats.dom);
        stats.dom.style.opacity = 0.6;
        stats.dom.style.right = "10px";
        stats.dom.style.top = "5px";
        stats.dom.style.left = "auto";

        this.statTicker = () => {
          stats.update();
        };

        this.Layout.ticker.add(this.statTicker);
      } else {
        this.Layout.ticker.remove(this.statTicker);
        this.stats.dom.remove();
        this.stats = null;
      }
    },

    detectDevtoolsInit() {
      if (this.Layout) {
        return true;
      }

      this.showDevToolsNotInit = true;

      return false;
    },
  },
});
</script>

<template>
  <div>
    <div class="dev__container" ref="container">
      <span>Layout调试工具箱</span>
      <Button
        @click="doTCompile"
        label="doT"
        severity="secondary"
        outlined
        size="small"
      />
      <Button
        @click="goToDoc"
        label="doc"
        severity="secondary"
        outlined
        size="small"
      />
      <Button
        @click="goToDemos"
        label="demos"
        severity="secondary"
        outlined
        size="small"
      />
      <Button
        @click="toggleStat"
        label="stats"
        severity="secondary"
        outlined
        size="small"
      />

      <Dialog
        @hide="hideDialog"
        v-model:visible="visible"
        modal
        header="模板函数"
        :style="{ width: '50vw', 'min-width': '400px' }"
      >
        <Message
          v-for="msg of messages"
          :key="msg.id"
          :severity="msg.severity"
          >{{ msg.content }}</Message
        >

        <highlightjs language="javascript" :code="code" />

        <Button
          @click="copyCode"
          label="复制到剪切板"
          severity="success"
          size="small"
        />
      </Dialog>

      <Dialog
        v-model:visible="showNoXMLDialog"
        modal
        header="温馨提示"
        :style="{ width: '50vw', 'min-width': '400px' }"
      >
        <Message :closable="false"
          >没有监听到模板，请参照下面的格式在html内注入模板</Message
        >

        <highlightjs language="xml" :code="xmlDemo" />
      </Dialog>

      <Dialog
        v-model:visible="showDevToolsNotInit"
        modal
        header="温馨提示"
        :style="{ width: '50vw', 'min-width': '400px' }"
      >
        <Message :closable="false"
          >LayoutDevtools没有初始化，请执行下列代码</Message
        >

        <highlightjs language="javascript" :code="devtoolsNotInitCode" />
      </Dialog>
    </div>

    <component v-if="demoComponent" :is="demoComponent" />    
  </div>
</template>

<style scoped>
html {
  font-size: 14px;
}

body {
  font-family: (--font-family);
  font-size: 14px;
}

.dev__container {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: solid 1px #f3f3f3;
  margin-bottom: 10px;
}

.p-button.p-button-sm {
  padding: 0.3rem 1.1rem;
}

.p-button {
  margin-left: 5px;
}
</style>
