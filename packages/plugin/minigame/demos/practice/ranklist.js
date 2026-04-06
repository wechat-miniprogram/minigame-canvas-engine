module.exports = function ranklist(Layout, canvas, ctx) {
  const W = 960;
  const H = 1410;

  // 创建 mock 数据
  const item = {
    nickname: 'zim',
    rankScore: 1,
    avatarUrl: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
  };
  const data = [];
  for (let i = 0; i < 20; i++) {
    const cp = JSON.parse(JSON.stringify(item));
    cp.rankScore = Math.floor(Math.random() * 1000 + 1);
    if (i % 2 === 1) cp.nickname = '这是一个很长的玩家昵称会自动换行';
    data.push(cp);
  }

  // 拼接 XML 模板（不依赖 doT）
  let listItems = '';
  data.forEach((d, index) => {
    const cls = index % 2 === 1 ? 'listItem listItemOld' : 'listItem';
    listItems += `
      <view class="${cls}">
        <text class="listItemNum" value="${index + 1}"></text>
        <image class="listHeadImg" src="${d.avatarUrl}"></image>
        <text class="listItemName" value="${d.nickname}"></text>
        <text class="listItemScore" value="${d.rankScore}"></text>
        <text class="listScoreUnit" value="分"></text>
      </view>`;
  });

  const tpl = `
    <view class="container" id="main">
      <view class="header">
        <text class="title" value="排行榜"></text>
      </view>
      <view class="rankList">
        <scrollview id="list" class="list" scrollY="true">
          ${listItems}
        </scrollview>
        <text class="listTips" value="仅展示前20位好友排名"></text>
        <view class="listItem selfListItem">
          <text class="listItemNum" value="1"></text>
          <image class="listHeadImg" src="${item.avatarUrl}"></image>
          <text class="listItemName" value="${item.nickname}"></text>
          <text class="listItemScore" value="${data[0].rankScore}"></text>
          <text class="listScoreUnit" value="分"></text>
        </view>
      </view>
    </view>`;

  const style = {
    container: {
      width: W,
      height: H,
      borderRadius: 12,
      backgroundColor: '#f3f3f3',
    },
    header: {
      height: 120,
      width: W,
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderBottomWidth: 0.5,
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    title: {
      width: 144,
      fontSize: 48,
      height: 120,
      lineHeight: 120,
      textAlign: 'center',
      fontWeight: 'bold',
      borderBottomWidth: 6,
      borderColor: '#000000',
      verticalAlign: 'middle',
    },
    rankList: {
      width: W,
      height: H - 120,
      backgroundColor: '#ffffff',
    },
    list: {
      width: W,
      height: 950,
      backgroundColor: '#ffffff',
      marginTop: 30,
    },
    listItem: {
      backgroundColor: '#F7F7F7',
      width: W,
      height: 150,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listItemOld: {
      backgroundColor: '#ffffff',
    },
    listItemNum: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 150,
      height: 150,
      textAlign: 'center',
      width: 120,
      verticalAlign: 'middle',
    },
    listHeadImg: {
      width: 90,
      height: 90,
      borderRadius: 15,
      borderWidth: 5,
      borderColor: 'red',
    },
    listItemScore: {
      fontSize: 48,
      fontWeight: 'bold',
      marginLeft: 10,
      height: 150,
      lineHeight: 150,
      width: 300,
      textAlign: 'right',
    },
    listItemName: {
      fontSize: 36,
      height: 150,
      lineHeight: 150,
      width: 350,
      marginLeft: 30,
      textShadow: '1px 1px 2px blue',
    },
    listScoreUnit: {
      opacity: 0.5,
      color: '#000000',
      fontSize: 30,
      height: 150,
      lineHeight: 150,
      marginLeft: 8,
    },
    selfListItem: {
      borderRadius: 20,
      marginTop: 20,
      backgroundColor: '#ffffff',
    },
    listTips: {
      width: W,
      height: 90,
      lineHeight: 90,
      textAlign: 'center',
      fontSize: 30,
      color: 'rgba(0,0,0,0.5)',
      backgroundColor: '#ffffff',
      borderRadius: 10,
    },
  };

  Layout.clear();
  Layout.init(tpl, style);

  // 设置 canvas 物理尺寸适配
  canvas.width = W;
  canvas.height = H;

  Layout.layout(ctx);

  const selfListItem = Layout.getElementsByClassName('listItem')[0];
  selfListItem.on('click', () => {
    if (selfListItem.classList.contains('listItemOld')) {
      selfListItem.classList.remove('listItemOld');
      selfListItem.classList.remove('selfListItem');
    } else {
      selfListItem.classList.add('listItemOld');
      selfListItem.classList.add('selfListItem');
    }
  });
};
