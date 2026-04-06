/**
 * 邀请好友 - 开放数据域实现
 * 
 * 在 sub/index.js 中通过 wx.onMessage 接收主域消息来触发：
 *   OpenDataContext.postMessage({ event: 'showInvite', box: canvas.getBoundingClientRect() });
 * 
 * 使用 wx.getPotentialFriendList 获取可能感兴趣的未注册好友（每次最多5个）
 * 使用 wx.shareMessageToFriend 给好友发送邀请消息
 */

const Layout = requirePlugin('Layout').default;

let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');

const W = 960;
const H = 1410;
const ITEM_W = Math.floor(W / 5);

const style = {
  container: {
    width: W,
    height: H,
    backgroundColor: '#ffffff',
  },
  header: {
    width: W,
    height: 120,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    width: W,
    height: 120,
    lineHeight: 120,
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold',
  },
  refreshBtn: {
    fontSize: 36,
    color: '#4FC3F7',
    position: 'absolute',
    right: 30,
    top: 0,
    height: 120,
    lineHeight: 120,
    ':active': {
      transform: 'scale(1.05, 1.05)',
    },
  },
  body: {
    width: W,
    height: H - 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: W,
    height: H - 120,
    flexDirection: 'row',
    paddingTop: 50,
    justifyContent: 'space-around',
  },
  // loading
  loadingContainer: {
    width: W,
    height: H - 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  // 列表项
  listItem: {
    width: ITEM_W,
    alignItems: 'center',
  },
  listAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  listNickName: {
    fontSize: 36,
    color: '#333333',
    height: 60,
    lineHeight: 60,
    marginTop: 16,
    textAlign: 'center',
    width: ITEM_W,
    textOverflow: 'ellipsis',
  },
  inviteBtn: {
    fontSize: 34,
    color: '#ffffff',
    backgroundColor: '#4FC3F7',
    width: ITEM_W - 30,
    height: 70,
    lineHeight: 70,
    textAlign: 'center',
    borderRadius: 35,
    marginTop: 16,
    ':active': {
      transform: 'scale(1.05, 1.05)',
    },
  },
  invitedBtn: {
    backgroundColor: '#cccccc',
  },
  emptyText: {
    width: W,
    height: 100,
    lineHeight: 100,
    fontSize: 40,
    color: '#999999',
    textAlign: 'center',
  },
};

function showLoadingState() {
  const tpl = ''
    + '<view class="container">'
    + '  <view class="header">'
    + '    <text class="title" value="推荐好友"></text>'
    + '  </view>'
    + '  <view class="loadingContainer">'
    + '    <image src="sub/images/loading.png" id="loadingImg" class="loadingImg"></image>'
    + '  </view>'
    + '</view>';

  Layout.clear();
  Layout.init(tpl, style);

  Layout.layout(sharedContext);

  // 旋转动画
  const image = Layout.getElementById('loadingImg');
  let degrees = 0;
  Layout.ticker.add(function () {
    if (image.isDestroyed) return;
    degrees = (degrees + 2) % 360;
    image.style.transform = 'rotate(' + degrees + 'deg)';
  });
}

function renderFriendList(friends) {
  let listTpl = '';

  if (friends.length === 0) {
    listTpl = '<text class="emptyText" value="暂无推荐好友"></text>';
  } else {
    friends.forEach(function (friend, i) {
      const avatar = friend.avatarUrl || '';
      const name = friend.nickname || '好友' + (i + 1);
      listTpl +=
        '<view class="listItem">'
        + '<image class="listAvatar" src="' + avatar + '"></image>'
        + '<text class="listNickName" value="' + name + '"></text>'
        + '<text class="inviteBtn invite_' + i + '" value="邀请"></text>'
        + '</view>';
    });
  }

  const tpl = ''
    + '<view class="container">'
    + '  <view class="header">'
    + '    <text class="title" value="推荐好友"></text>'
    + '    <text id="refreshBtn" class="refreshBtn" value="换一批"></text>'
    + '  </view>'
    + '  <view class="list">'
    + listTpl
    + '  </view>'
    + '</view>';

  Layout.clear();
  Layout.init(tpl, style);
  Layout.layout(sharedContext);

  // 绑定邀请按钮
  friends.forEach(function (friend, i) {
    const btns = Layout.getElementsByClassName('invite_' + i);
    if (btns && btns[0]) {
      btns[0].on('click', function () {
        wx.shareMessageToFriend({
          openId: friend.openid,
          title: '快来一起玩吧！',
          success: function () {
            console.log('[Invite] 邀请成功', friend.nickname);
            btns[0].value = '已邀请';
            btns[0].classList.add('invitedBtn');
          },
          fail: function (err) {
            console.log('[Invite] 邀请失败', err);
          },
        });
      });
    }
  });

  // 换一批
  const refreshBtn = Layout.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.on('click', function () {
      showLoadingState();
      loadAndRender();
    });
  }
}

function loadAndRender() {
  wx.getPotentialFriendList({
    success: function (res) {
      renderFriendList(res.list || []);
    },
    fail: function (err) {
      console.log('[Invite] getPotentialFriendList fail', err);
      renderFriendList([]);
    },
  });
}

export function showInvite() {
  showLoadingState();
  loadAndRender();
}
