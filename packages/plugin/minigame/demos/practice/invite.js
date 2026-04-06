module.exports = function invite(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <view id="container">
        <view class="header">
          <text class="title" value="推荐好友"></text>
          <text class="toggleButton" value="换一批"></text>
        </view>
        <view class="list">
          <view class="listItem">
            <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
            <text class="listNickName" value="zim1"></text>
            <text class="listInviteButton" value="邀请"></text>
          </view>
          <view class="listItem">
            <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
            <text class="listNickName" value="zim2"></text>
            <text class="listInviteButton" value="邀请"></text>
          </view>
          <view class="listItem">
            <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
            <text class="listNickName" value="zim3"></text>
            <text class="listInviteButton" value="邀请"></text>
          </view>
          <view class="listItem">
            <image class="listAvatar" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg"></image>
            <text class="listNickName" value="zim4"></text>
            <text class="listInviteButton" value="邀请"></text>
          </view>
        </view>
      </view>
    </view>
  `;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f3f3f3',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: H - statusBarH,
      backgroundColor: '#f3f3f3',
    },
    header: {
      width: '100%',
      height: 140,
    },
    title: {
      width: '100%',
      height: 140,
      lineHeight: 140,
      textAlign: 'center',
      fontSize: 48,
    },
    toggleButton: {
      fontSize: 40,
      position: 'absolute',
      right: 30,
      top: 0,
      height: 140,
      lineHeight: 140,
    },
    list: {
      flexDirection: 'row',
      width: '100%',
    },
    listItem: {
      width: '25%',
      alignItems: 'center',
    },
    listAvatar: {
      width: 120,
      height: 120,
      borderRadius: 12,
    },
    listNickName: {
      fontSize: 38,
      height: 50,
      marginTop: 12,
    },
    listInviteButton: {
      fontSize: 38,
      width: '100%',
      textAlign: 'center',
      height: 50,
      ':active': {
        transform: 'scale(1.05, 1.05)',
      },
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const buttons = Layout.getElementsByClassName('listInviteButton');
  buttons.forEach((button) => {
    button.on('click', () => {
      console.log('[Invite] button click');
    });
  });
};
