<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `
`

let style = {}

export default defineComponent({
  components: {
  },
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
    init() {
      const Layout = (window as any).Layout;
    }
  }
});
</script>
<template>
  <canvas id="tween"></canvas>
</template>