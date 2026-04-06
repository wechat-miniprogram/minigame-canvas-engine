module.exports = function styleAdvanced(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const IMG_URL = 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg';

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <scrollview id="container" scrollY="true">
        <text class="title" value="样式进阶示例"></text>

        <!-- display -->
        <text class="text" value="display: none 元素不参与布局，不占空间"></text>
        <view class="demoBox rowBox">
          <view class="box box1">
            <text class="boxLabel" value="1"></text>
          </view>
          <view class="box box2 displayNone">
            <text class="boxLabel" value="2"></text>
          </view>
          <view class="box box3">
            <text class="boxLabel" value="3"></text>
          </view>
        </view>
        <text class="hint" value="盒子2设置了 display:none，1和3紧挨在一起"></text>

        <text class="text" value="点击切换盒子2的显示/隐藏"></text>
        <view class="demoBox rowBox">
          <view class="box box1">
            <text class="boxLabel" value="1"></text>
          </view>
          <view id="toggleBox" class="box box2">
            <text class="boxLabel" value="2"></text>
          </view>
          <view class="box box3">
            <text class="boxLabel" value="3"></text>
          </view>
        </view>
        <text id="toggleBtn" class="btn" value="点击切换 display"></text>

        <!-- visibility -->
        <text class="text" value="visibility: hidden 元素不可见但仍占据布局空间"></text>
        <view class="demoBox rowBox">
          <view class="box box1">
            <text class="boxLabel" value="1"></text>
          </view>
          <view class="box box2 visibilityHidden">
            <text class="boxLabel" value="2"></text>
          </view>
          <view class="box box3">
            <text class="boxLabel" value="3"></text>
          </view>
        </view>
        <text class="hint" value="盒子2设置了 visibility:hidden，看不见但空间还在"></text>

        <!-- transform: rotate -->
        <text class="text" value="transform: rotate 旋转"></text>
        <view class="demoBox rowBox transformBox">
          <view class="transformItem">
            <image src="${IMG_URL}" class="transformImg rotate0"></image>
            <text class="transformLabel" value="0°"></text>
          </view>
          <view class="transformItem">
            <image src="${IMG_URL}" class="transformImg rotate30"></image>
            <text class="transformLabel" value="30°"></text>
          </view>
          <view class="transformItem">
            <image src="${IMG_URL}" class="transformImg rotate45"></image>
            <text class="transformLabel" value="45°"></text>
          </view>
          <view class="transformItem">
            <image src="${IMG_URL}" class="transformImg rotate90"></image>
            <text class="transformLabel" value="90°"></text>
          </view>
        </view>

        <!-- transform: scale -->
        <text class="text" value="transform: scale 缩放"></text>
        <view class="demoBox rowBox transformBox">
          <view class="transformItem">
            <view class="scaleBox scale50">
              <text class="boxLabel" value="0.5"></text>
            </view>
            <text class="transformLabel" value="50%"></text>
          </view>
          <view class="transformItem">
            <view class="scaleBox scale100">
              <text class="boxLabel" value="1.0"></text>
            </view>
            <text class="transformLabel" value="100%"></text>
          </view>
          <view class="transformItem">
            <view class="scaleBox scale150">
              <text class="boxLabel" value="1.5"></text>
            </view>
            <text class="transformLabel" value="150%"></text>
          </view>
        </view>

        <!-- opacity -->
        <text class="text" value="opacity 透明度"></text>
        <view class="demoBox rowBox transformBox">
          <view class="transformItem">
            <view class="box box1 opacity100"></view>
            <text class="transformLabel" value="100%"></text>
          </view>
          <view class="transformItem">
            <view class="box box1 opacity70"></view>
            <text class="transformLabel" value="70%"></text>
          </view>
          <view class="transformItem">
            <view class="box box1 opacity40"></view>
            <text class="transformLabel" value="40%"></text>
          </view>
          <view class="transformItem">
            <view class="box box1 opacity10"></view>
            <text class="transformLabel" value="10%"></text>
          </view>
        </view>

        <!-- 动态旋转 -->
        <text class="text" value="动态 transform 动画"></text>
        <view class="demoBox rowBox justifyCenter">
          <image id="spinImg" src="${IMG_URL}" class="spinImg"></image>
        </view>
        <text class="hint" value="通过 ticker 每帧修改 transform 实现旋转动画"></text>
      </scrollview>
    </view>
  `;

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f7f7f7',
    },
    statusBar: {
      width: W,
      height: statusBarH,
    },
    container: {
      width: W,
      height: H - statusBarH,
      padding: 30,
    },
    title: {
      width: '100%',
      height: 100,
      fontSize: 48,
      lineHeight: 100,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      width: '100%',
      fontSize: 36,
      marginTop: 30,
      color: '#333333',
    },
    hint: {
      width: '100%',
      fontSize: 30,
      color: '#999999',
      marginTop: 8,
    },
    demoBox: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
    },
    rowBox: {
      flexDirection: 'row',
    },
    justifyCenter: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 通用盒子
    box: {
      width: 100,
      height: 100,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    box1: { backgroundColor: '#4FC3F7' },
    box2: { backgroundColor: '#FF8A65' },
    box3: { backgroundColor: '#81C784' },
    boxLabel: {
      width: 100,
      height: 100,
      lineHeight: 100,
      fontSize: 36,
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    // display
    displayNone: {
      display: 'none',
    },

    // visibility
    visibilityHidden: {
      visibility: 'hidden',
    },

    // 按钮
    btn: {
      width: '100%',
      height: 80,
      lineHeight: 80,
      fontSize: 34,
      color: '#ffffff',
      backgroundColor: '#4FC3F7',
      borderRadius: 12,
      textAlign: 'center',
      marginTop: 12,
    },

    // transform
    transformBox: {
      justifyContent: 'space-around',
      height: 200,
      alignItems: 'center',
    },
    transformItem: {
      alignItems: 'center',
    },
    transformImg: {
      width: 100,
      height: 100,
      borderRadius: 12,
    },
    transformLabel: {
      width: 100,
      height: 40,
      lineHeight: 40,
      fontSize: 28,
      color: '#999999',
      textAlign: 'center',
      marginTop: 16,
    },
    rotate0:  { transform: 'rotate(0deg)' },
    rotate30: { transform: 'rotate(30deg)' },
    rotate45: { transform: 'rotate(45deg)' },
    rotate90: { transform: 'rotate(90deg)' },

    // scale
    scaleBox: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: '#BA68C8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scale50:  { transform: 'scale(0.5, 0.5)' },
    scale100: { transform: 'scale(1, 1)' },
    scale150: { transform: 'scale(1.5, 1.5)' },

    // opacity
    opacity100: { opacity: 1.0 },
    opacity70:  { opacity: 0.7 },
    opacity40:  { opacity: 0.4 },
    opacity10:  { opacity: 0.1 },

    // 动态旋转
    spinImg: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  // display 切换交互
  const toggleBox = Layout.getElementById('toggleBox');
  const toggleBtn = Layout.getElementById('toggleBtn');
  let visible = true;
  toggleBtn.on('click', () => {
    visible = !visible;
    toggleBox.style.display = visible ? 'flex' : 'none';
    toggleBtn.value = visible ? '点击切换 display (当前: 显示)' : '点击切换 display (当前: 隐藏)';
  });

  // 动态旋转动画
  const spinImg = Layout.getElementById('spinImg');
  let degrees = 0;
  Layout.ticker.add(() => {
    degrees = (degrees + 2) % 360;
    spinImg.style.transform = 'rotate(' + degrees + 'deg)';
  });
};
