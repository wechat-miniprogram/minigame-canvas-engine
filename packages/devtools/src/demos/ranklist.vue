<script lang="ts">
import { defineComponent } from "vue";
import { template } from "dot";

let tpl = `
  <view class="container" id="main">
    <view class="header">
      <text font="fnt_number-export" class="title" value="等级"></text>
    </view>
    <view class="rankList">
      <scrollview id="list" class="list" scrollY="true">
          {{~it.data :item:index}}
              {{? index % 2 === 1 }}
              <view class="listItem listItemOld">
              {{?}}
              {{? index % 2 === 0 }}
              <view class="listItem">
              {{?}}
                  <text font="fnt_number-export" class="listItemNum" value="{{= index + 1}}"></text>
                  <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                <text class="listItemName" value="{{= item.nickname}}"></text>
                <text class="listItemScore" value="{{= item.rankScore}}"></text>
                <text class="listScoreUnit" value="分"></text>
              </view>
          {{~}}
      </scrollview>
      <text class="listTips" value="仅展示前50位好友排名"></text>

      <view class="listItem selfListItem">
          <text font="fnt_number-export" class="listItemNum" value="{{= it.selfIndex}}"></text>
          <image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
          <text class="listItemName" value="{{= it.self.nickname}}"></text>
          <text class="listItemScore" value="{{= item.rankScore}}"></text>
          <text class="listScoreUnit" value="分"></text>
      </view>
    </view>
  </view>
`;

let style = {
  container: {
    width: 960,
    height: 1410,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
  },
  header: {
    height: 120,
    width: 960,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    width: 144,
    fontSize: 48,
    height: 120,
    lineHeight: 120,
    textAlign: "center",
    fontWeight: "bold",
    borderBottomWidth: 6,
    borderColor: "#000000",
    verticalAlign: "middle",
  },
  rankList: {
    width: 960,
    height: 1410 - 120,
    backgroundColor: "#ffffff",
  },
  list: {
    width: 960,
    height: 950,
    backgroundColor: "#ffffff",
    marginTop: 30,
  },
  listItem: {
    backgroundColor: "#F7F7F7",
    width: 960,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemOld: {
    backgroundColor: "#ffffff",
  },
  listItemNum: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 150,
    height: 150,
    textAlign: "center",
    width: 120,
    verticalAlign: "middle",
  },
  listHeadImg: {
    width: 90,
    height: 90,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: "red",
  },
  listItemScore: {
    fontSize: 48,
    fontWeight: "bold",
    marginLeft: 10,
    height: 150,
    lineHeight: 150,
    width: 300,
    textAlign: "right",
  },
  listItemName: {
    fontSize: 36,
    height: 150,
    lineHeight: 150,
    width: 350,
    marginLeft: 30,
    textShadow: '1px 1px 2px #0000ff',
  },
  listScoreUnit: {
    opacity: 0.5,
    color: "#000000",
    fontSize: 30,
    height: 150,
    lineHeight: 150,
    marginLeft: 8,
  },
  selfListItem: {
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#ffffff",
  },
  listTips: {
    width: 960,
    height: 90,
    lineHeight: 90,
    textAlign: "center",
    fontSize: 30,
    color: "rgba(0,0,0,0.5)",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
};

export default defineComponent({
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    init() {
      // for devtools debug
      if (process.env.NODE_ENV !== 'production') {
        (window as any).layoutTpl = tpl;
      }
      const Layout = (window as any).Layout;
      // 创建mock数据
      let item = {
        nickname: "zim",
        rankScore: 1,
        avatarUrl:
          "https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg",
      };
      let datasource = {
        data: [],
        selfIndex: 1,
        self: item,
      };
      for (let i = 0; i < 20; i++) {
        var cp: any = JSON.parse(JSON.stringify(item));
        cp.rankScore = Math.floor(Math.random() * 1000 + 1);
        datasource.data.push(cp);
      }

      // 将XML模板编译成XML字符串
      let tempFn = template(tpl);
      let resultText = tempFn(datasource);

      let canvas = document.getElementById("ranklist") as HTMLCanvasElement;
      let context = canvas.getContext("2d");

      // 每次初始化之前先执行清理逻辑保证内存不会一直增长
      Layout.clear();
      // 初始化引擎
      Layout.init(resultText, style);

      // 设置canvas的尺寸和样式的container比例一致
      canvas.width = 960;
      canvas.height = 1410;
      canvas.style.width = 300 + "px";
      canvas.style.height = (canvas.height / canvas.width) * 300 + "px";

      Layout.updateViewPort(canvas.getBoundingClientRect());

      Layout.layout(context);

      const list = Layout.getElementById('list');

      const selfListItem = Layout.getElementsByClassName('listItem')[0]

      selfListItem.on('click', () => {
        if (selfListItem.classList.contains('listItemOld')) {
          selfListItem.classList.remove('listItemOld');
          selfListItem.classList.remove('selfListItem');
        } else {
          selfListItem.classList.add('listItemOld');
          selfListItem.classList.add('selfListItem');
        }
      })

      // @ts-ignore
      window.list = list;
    },
  },
});
</script>
<template>
  <canvas id="ranklist"></canvas>
</template>
