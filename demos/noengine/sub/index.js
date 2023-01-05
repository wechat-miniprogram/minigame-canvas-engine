import style from "render/style.js";
import tplFn from "render/tplfn.js";
import Layout from "./engine.js";
// const Layout = requirePlugin('Layout').default;

import {
  getFriendData,
  setUserRecord,
  getUserInfo,
  findSelf,
  injectSelfToList,
  replaceSelfDataInList,
} from "data.js";

let postType;
let userinfo;
let selfData;
let key = "rankScore";
let currentMaxScore = 0;
let cacheRankData = [];

let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext("2d");

function draw(data = []) {
  let template = tplFn({
    data,
    self: data[0],
    selfIndex: 1,
  });
  Layout.clear();
  Layout.init(template, style);
  Layout.layout(sharedContext);
  console.log(Layout);

  // Layout.ticker.next(() => {
  //   console.log('test ticker next method');
  // })

  // const list = Layout.getElementsByClassName('list')[0];
  // console.log(list)

  // const listItem = Layout.getElementsByClassName('listItem')[1];


  /**
   * tween不直接作用于节点，否则一个列表大量的节点都执行tween操作性能必然会差
   * 因此维护一个与节点无关的 globalTween，每帧检查是 globalTween 应该作用于哪些节点
   * 每次 Layout.clear 记得清理或者重置 globalTween
   */
  let globalStyle = { width: 90, height: 90 }
  let globalTween = new Layout.TWEEN.Tween(globalStyle).to({
    width: 70,
    height: 70
  }).repeat(Infinity).yoyo(true).easing(Layout.TWEEN.Easing.Bounce.Out).start();

  const list = Layout.getElementsByClassName('list')[0];
  const listItems = Layout.getElementsByClassName('listHeadImg');
  const box = list.layoutBox;


  console.log(listItems[0].getBoundingClientRect())
  listItems[19].on('click', () => {
    console.log('click listitem 19');
  })

  function manualTween() {
    // scrollview在全局节点中的Y轴位置
    const abY = box.absoluteY;
    const abX = box.absoluteX;

    // 根据滚动值获取裁剪区域
    const startY = abY + list.scrollTop;
    const endY = abY + list.scrollTop + box.height;
    const startX = abX + list.scrollLeft;
    const endX = abX + list.scrollLeft + box.width;

    listItems.forEach((item, index) => {
      const { layoutBox } = item;
      const { height } = layoutBox;
      const { width } = layoutBox;
      const originY = layoutBox.originalAbsoluteY;
      const originX = layoutBox.originalAbsoluteX;

      // 判断处于可视窗口内的子节点，递归渲染该子节点
      if (originY + height >= startY && originY <= endY
        && originX + width >= startX && originX <= endX) {
          // item.style.width = globalStyle.width;
          item.style.height = globalStyle.height;
      }
    });
  }

  // Layout.ticker.add(() => {
  //   manualTween();
  // });

  // setInterval(() => {
  //   console.log(Layout.debugInfo)
  // }, 3000)

  // setTimeout(() => {
  //   Layout.clear();
  //   Layout.init(template, style);
  //   Layout.layout(sharedContext);
  //   // console.log(Layout);
  // }, 3000)

  // const listItems = Layout.getElementsByClassName('listHeadImg');
  // setTimeout(() => {
  //   listItems[0].src = listItems[1].src;
  // }, 3000)

  console.log(Layout.debugInfo)

  // Setup the animation loop.
  // function animate(time) {
  //   requestAnimationFrame(animate)
  //   TWEEN.update()
  // }
  // requestAnimationFrame(animate)

  // listItem.on('click', () => {
  //   console.log('click')
  //   let target = listItem.style.height === 150 ? 300 : 150;
  //   listItem.style.top = 0
  //   new Layout.TWEEN.Tween(listItem.style)
  //   .to({ top: -150 }, 1000)
  //   .easing(Layout.TWEEN.Easing.Bounce.Out)
  //   .onUpdate(() => {
  //   }).onComplete(() => {
  //     // console.log(Layout)
  //   }).start();
  // });
}

function loadFriendDataAndRender(key, info, needRender = true) {
  getFriendData(key, (data) => {
    let find = findSelf(data, info);
    selfData = find.self;

    /**
     * 拉取排行榜的时候无法确定排行榜中是否有自己，或者即便有自己分数也是旧的
     * 如果拉取排行榜之前先调用setUserCloudStorage来上报分数再拉取排行榜
     * 那么第一次渲染排行榜会非常之慢。针对这种场景需要根据情况处理：
     * 1. 如果拉取排行榜之前有调用分数上报接口，将每次上报的分数缓存起来，然后插入或者替换排行榜中的自己
     * 2. 如果拉取排行榜之前没有调用分数上报接口，忽略1的逻辑
     */
    if (!selfData && currentMaxScore !== undefined) {
      injectSelfToList(data, info, currentMaxScore);
    } else if (selfData && currentMaxScore !== undefined) {
      // 替换自己的分数
      replaceSelfDataInList(data, info, currentMaxScore);
    }

    // 缓存数据，加速下次渲染
    cacheRankData = data;

    // mock
    for (let i = data.length; i < 100; i++) {
      data[i] = JSON.parse(JSON.stringify(data[0]));
      data[i].rank = i;
      data[i].rankScore = Math.floor(Math.random() * 1000 + 1);
    }

    if (needRender) {
      draw(data, selfData, currentMaxScore);
    }

    let btnList = Layout.getElementsByClassName("giftBtn");
    for (let i = 0; i < btnList.length; i++) {
      btnList[i].on("click", (e) => {
        let img = Layout.getElementsById("img" + i);
        img[0].src =
          img[0].src === "sub/Buffet_icon_GiftPlate_0.png" ?
          "sub/Buffet_icon_GiftPlate.png" :
          "sub/Buffet_icon_GiftPlate_0.png";
      });
    }
  });
}

function init() {
  currentMaxScore = 0;
  cacheRankData = [];

  wx.onMessage((data) => {
    console.log("onMessage", data);
    if (data.event === "updateViewPort") {
      Layout.updateViewPort(data.box);
      getUserInfo((info) => {
        userinfo = info;
        loadFriendDataAndRender(key, info);
      });
    }
  });
}

function showFriendRank() {
  if (cacheRankData && cacheRankData.length) {
    // 更新缓存数据
    if (userinfo && currentMaxScore) {
      replaceSelfDataInList(cacheRankData, userinfo, currentMaxScore);
    }

    draw(cacheRankData, selfData, currentMaxScore);
  }

  /**
   * 用户信息会在子域初始化的时候去拉取
   * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
   */
  if (!userinfo) {
    getUserInfo((info) => {
      userinfo = info;
      loadFriendDataAndRender(key, info);
    });
  } else {
    loadFriendDataAndRender(key, userinfo);
  }
}

init();

// let sharedCanvas = wx.getSharedCanvas()
// let context = sharedCanvas.getContext('2d')

// const img = new wx.createImage();

// img.src = 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBjcbgQdZeahMWPibgH4OuJ7ia3qUv5CKzkLib5v3M7X1eoKJBMY9OcnYuJhrWtGWmY1fGOicQjlOXJg/132'

// const canvas = wx.createCanvas();
// canvas.width = 100;
// canvas.height = 100;

// const ctx = canvas.getContext('2d');

// function render() {
//     ctx.fillStyle = 'blue'
//     ctx.fillRect(0, 0, 100, 100)

//   context.drawImage(img, 0, 0, 200, 200)

// //   context.drawImage(canvas, 0, 0, 200, 200)

//   requestAnimationFrame(render)
// }

// render()

// setTimeout(() => {
//     try {
//         console.log(window)
//         console.log(XMLHttpRequest)
//         console.log(URL)
//     } catch(e) {
//         console.log(e)
//     }
// }, 7000)
