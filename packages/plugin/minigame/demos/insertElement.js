module.exports = function insertElement(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const tpl = `
    <view class="container">
      <text class="loading" value="加载中..."></text>
      <scrollview class="scrollView" scrollY="true"></scrollview>
    </view>
  `;

  const style = {
    container: {
      left: 0,
      top: 0,
      width: W,
      height: H,
      backgroundColor: '#fff',
    },
    scrollView: {
      left: 0,
      top: 0,
      width: W,
      height: H,
    },
    loading: {
      position: 'absolute',
      left: 0,
      top: H / 3 - 20,
      fontSize: 28,
      width: W,
      lineHeight: 40,
      color: 'rgba(0,0,0,0.9)',
      textAlign: 'center',
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // 模拟 1 秒后数据加载完成
  setTimeout(() => {
    let template = '';
    const data = [];
    for (let i = 1; i <= 8; i++) {
      data.push({
        openId: '' + i,
        avatarUrl: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
        nickName: 'zim' + i,
      });
    }

    data.forEach((user) => {
      template += `
        <view class="item ${user.openId}">
          <image src="${user.avatarUrl}" class="avatar"></image>
          <text class="name" value="${user.nickName}"></text>
        </view>
      `;
    });

    const itemStyle = {
      item: {
        flexDirection: 'row',
        padding: 36,
        alignItems: 'center',
      },
      avatar: {
        width: 72,
        height: 72,
        borderRadius: 12,
      },
      name: {
        color: 'rgba(0,0,0,0.9)',
        fontSize: 44,
        marginLeft: 24,
        width: 400,
        textOverflow: 'ellipsis',
      },
    };

    const loading = Layout.getElementsByClassName('loading')[0];
    if (loading) loading.remove();
    const scrollView = Layout.getElementsByClassName('scrollView')[0];
    Layout.insertElement(template, itemStyle, scrollView);
  }, 1000);
};
