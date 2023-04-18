<script lang="ts">
const doT = require("dot");
// let beautify: any = require('js-beautify').js;

export default {
  data() {
    return {
      count: 0,
      dialog: false,
      code: "",
    };
  },

  mounted() {
    this.dotCompile();
  },

  methods: {
    dotCompile() {
      const xml = `
        <view class="container" id="main">
          <view class="header">
            <bitmaptext font="fnt_number-export" class="title" value="等级"></bitmaptext>
          </view>
          <view class="rankList">
                <scrollview class="list" scrollY="true">
                    {{~it.data :item:index}}
                        {{? index % 2 === 1 }}
                        <view class="listItem listItemOld"> 
                        {{?}}
                        {{? index % 2 === 0 }}
                        <view class="listItem">
                        {{?}}
                            <bitmaptext font="fnt_number-export" class="listItemNum" value="{{= index + 1}}"></bitmaptext>
                            <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                          <text class="listItemName" value="{{= item.nickname}}"></text>
                          <text class="listItemScore" value="{{= item.rankScore}}"></text>
                          <text class="listScoreUnit" value="分"></text>
                        </view>
                    {{~}}
                </scrollview>
                <text class="listTips" value="仅展示前50位好友排名"></text>

                <view class="listItem selfListItem">
                    <bitmaptext font="fnt_number-export" class="listItemNum" value="{{= it.selfIndex}}"></bitmaptext>
                    <image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
                    <text class="listItemName" value="{{= it.self.nickname}}"></text>
                    <text class="listItemScore" value="{{= item.rankScore}}"></text>
                    <text class="listScoreUnit" value="分"></text>
                </view>
            </view>
        </view>
        `;
      let comment = `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;
      // let be = beautify(String(doT.template(xml)), { indent_size: 4, space_in_empty_paren: true })

      // this.code = `${comment}${be}`;

      this.dialog = true;
      console.log(String(doT.template(xml)));
    },
  },
};
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.layoutbutton {
  text-transform: none;
}
</style>
