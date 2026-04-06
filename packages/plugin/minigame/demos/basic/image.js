module.exports = function imageDemo(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const SECTION_W = W - 60;
  const IMG_URL = 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg';

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <scrollview id="container" scrollY="true">
        <!-- 基本图片 -->
        <text class="sectionTitle" value="基本图片"></text>
        <view class="section rowSection">
          <image src="${IMG_URL}" class="basicImg"></image>
          <view class="descBox">
            <text class="desc" value="直接设置 src 即可加载网络图片，图片会自动拉伸填充指定区域。"></text>
          </view>
        </view>

        <!-- 圆角图片 -->
        <text class="sectionTitle" value="圆角图片"></text>
        <view class="section rowSection">
          <image src="${IMG_URL}" class="roundedImg"></image>
          <image src="${IMG_URL}" class="circleImg"></image>
          <image src="${IMG_URL}" class="customRadiusImg"></image>
        </view>

        <!-- 不同尺寸 -->
        <text class="sectionTitle" value="不同尺寸"></text>
        <view class="section rowSection sizeSection">
          <view class="sizeItem">
            <image src="${IMG_URL}" class="sizeSmall"></image>
            <text class="sizeLabel" value="60x60"></text>
          </view>
          <view class="sizeItem">
            <image src="${IMG_URL}" class="sizeMedium"></image>
            <text class="sizeLabel" value="120x120"></text>
          </view>
          <view class="sizeItem">
            <image src="${IMG_URL}" class="sizeLarge"></image>
            <text class="sizeLabel" value="200x200"></text>
          </view>
        </view>

        <!-- 带边框 -->
        <text class="sectionTitle" value="带边框"></text>
        <view class="section rowSection">
          <image src="${IMG_URL}" class="borderImg1"></image>
          <image src="${IMG_URL}" class="borderImg2"></image>
          <image src="${IMG_URL}" class="borderImg3"></image>
        </view>

        <!-- 透明度 -->
        <text class="sectionTitle" value="透明度"></text>
        <view class="section rowSection">
          <view class="opacityItem">
            <image src="${IMG_URL}" class="img opacity100"></image>
            <text class="sizeLabel" value="100%"></text>
          </view>
          <view class="opacityItem">
            <image src="${IMG_URL}" class="img opacity60"></image>
            <text class="sizeLabel" value="60%"></text>
          </view>
          <view class="opacityItem">
            <image src="${IMG_URL}" class="img opacity30"></image>
            <text class="sizeLabel" value="30%"></text>
          </view>
        </view>

        <!-- 旋转 -->
        <text class="sectionTitle" value="旋转 transform"></text>
        <view class="section rowSection transformSection">
          <view class="transformItem">
            <image src="${IMG_URL}" class="img rotate15"></image>
            <text class="sizeLabel transformLabel" value="15°"></text>
          </view>
          <view class="transformItem">
            <image src="${IMG_URL}" class="img rotate45"></image>
            <text class="sizeLabel transformLabel" value="45°"></text>
          </view>
          <view class="transformItem">
            <image src="${IMG_URL}" class="img rotate90"></image>
            <text class="sizeLabel transformLabel" value="90°"></text>
          </view>
        </view>

        <!-- 图片列表布局 -->
        <text class="sectionTitle" value="图片列表布局"></text>
        <view class="section gridSection">
          <image src="${IMG_URL}" class="gridImg"></image>
          <image src="${IMG_URL}" class="gridImg"></image>
          <image src="${IMG_URL}" class="gridImg"></image>
          <image src="${IMG_URL}" class="gridImg"></image>
          <image src="${IMG_URL}" class="gridImg"></image>
          <image src="${IMG_URL}" class="gridImg"></image>
        </view>

        <!-- 头像 + 昵称组合 -->
        <text class="sectionTitle" value="头像 + 昵称组合"></text>
        <view class="section">
          <view class="userRow">
            <image src="${IMG_URL}" class="avatar"></image>
            <text class="userName" value="玩家昵称"></text>
          </view>
          <view class="userRow">
            <image src="${IMG_URL}" class="avatarSmall"></image>
            <text class="userNameSmall" value="玩家昵称(小头像)"></text>
          </view>
        </view>
      </scrollview>
    </view>
  `;

  const ITEM_W = Math.floor((SECTION_W - 40 - 30) / 3);

  const style = {
    wrapper: {
      width: W,
      height: H,
      backgroundColor: '#f0f0f0',
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
    sectionTitle: {
      width: '100%',
      fontSize: 38,
      color: '#666666',
      paddingTop: 30,
      paddingBottom: 10,
    },
    section: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: 20,
    },
    rowSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },

    // 基本图片
    basicImg: {
      width: 150,
      height: 150,
      borderRadius: 12,
    },
    descBox: {
      marginLeft: 20,
      width: SECTION_W - 150 - 80,
    },
    desc: {
      fontSize: 34,
      color: '#999999',
      width: SECTION_W - 150 - 80,
    },

    // 圆角
    roundedImg: {
      width: 120,
      height: 120,
      borderRadius: 16,
    },
    circleImg: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginLeft: 30,
    },
    customRadiusImg: {
      width: 120,
      height: 120,
      borderTopLeftRadius: 40,
      borderBottomRightRadius: 40,
      marginLeft: 30,
    },

    // 不同尺寸
    sizeSection: {
      justifyContent: 'space-around',
    },
    sizeItem: {
      alignItems: 'center',
    },
    sizeSmall: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    sizeMedium: {
      width: 120,
      height: 120,
      borderRadius: 8,
    },
    sizeLarge: {
      width: 200,
      height: 200,
      borderRadius: 8,
    },
    sizeLabel: {
      fontSize: 30,
      color: '#999999',
      textAlign: 'center',
      marginTop: 8,
      width: 200,
    },

    // 边框
    borderImg1: {
      width: 120,
      height: 120,
      borderRadius: 12,
      borderWidth: 4,
      borderColor: '#4FC3F7',
    },
    borderImg2: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 6,
      borderColor: '#FF8A65',
      marginLeft: 20,
    },
    borderImg3: {
      width: 120,
      height: 120,
      borderRadius: 12,
      borderWidth: 8,
      borderColor: '#81C784',
      marginLeft: 20,
    },

    // 透明度
    img: {
      width: 120,
      height: 120,
      borderRadius: 12,
    },
    opacityItem: {
      alignItems: 'center',
      marginRight: 30,
    },
    opacity100: { opacity: 1 },
    opacity60: { opacity: 0.6 },
    opacity30: { opacity: 0.3 },

    // 旋转
    transformSection: {
      justifyContent: 'space-around',
      height: 220,
    },
    transformItem: {
      alignItems: 'center',
      width: ITEM_W,
    },
    rotate15: { transform: 'rotate(15deg)' },
    rotate45: { transform: 'rotate(45deg)' },
    rotate90: { transform: 'rotate(90deg)' },
    transformLabel: {
      marginTop: 30,
    },

    // 九宫格
    gridSection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridImg: {
      width: ITEM_W,
      height: ITEM_W,
      borderRadius: 8,
      marginBottom: 15,
    },

    // 头像 + 昵称
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
    },
    userName: {
      fontSize: 36,
      color: '#333333',
      marginLeft: 20,
    },
    avatarSmall: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    userNameSmall: {
      fontSize: 30,
      color: '#666666',
      marginLeft: 16,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);
};
