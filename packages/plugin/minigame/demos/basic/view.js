module.exports = function viewDemo(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  const info = wx.getSystemInfoSync();
  const safeArea = info.safeArea || { top: 0 };
  const statusBarH = (safeArea.top || info.statusBarHeight || 20) * info.pixelRatio;

  const tpl = `
    <view id="wrapper">
      <view class="statusBar"></view>
      <scrollview id="container" scrollY="true">
        <text class="title" value="View 布局示例"></text>

        <text class="text" value="要了解View，首先要学习Flex布局，这非常重要。"></text>
        <text class="text" value="flexDirection 默认是column，所以默认是一行一行往下排列。"></text>

        <view class="flexContainer">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="你可以设置为row，改变盒子的排列方向"></text>

        <view class="flexContainer flexRow">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="大部分时候，通过alignItems让盒子们垂直居中对齐"></text>

        <view class="flexContainer flexRow alignCenter">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="如果横向也要居中，再加个 justifyContent 即可"></text>

        <view class="flexContainer flexRow alignCenter justifyCenter">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="justifyContent: space-between，两端对齐"></text>

        <view class="flexContainer flexRow alignCenter justifyBetween">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="justifyContent: space-around，等间距分布"></text>

        <view class="flexContainer flexRow alignCenter justifyAround">
          <view class="flexItem"></view>
          <view class="flexItem"></view>
          <view class="flexItem"></view>
        </view>

        <text class="text" value="flexWrap: wrap，盒子放不下会自动换行"></text>

        <view class="flexContainer flexContainerTall flexRow flexWrap">
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
          <view class="wrapItem"></view>
        </view>

        <text class="text" value="flexGrow 可以让盒子按比例占满剩余空间"></text>

        <view class="flexContainer flexRow alignCenter">
          <view class="growItem grow1">
            <text class="growLabel" value="1"></text>
          </view>
          <view class="growItem grow2">
            <text class="growLabel" value="2"></text>
          </view>
          <view class="growItem grow1">
            <text class="growLabel" value="1"></text>
          </view>
        </view>

        <text class="text" value="嵌套布局：View可以无限嵌套来实现复杂布局"></text>

        <view class="flexContainer flexRow">
          <view class="nestedCol">
            <view class="flexItem"></view>
            <view class="flexItem"></view>
          </view>
          <view class="nestedBig"></view>
        </view>
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
      marginTop: 24,
      color: '#333333',
    },
    flexContainer: {
      width: '100%',
      height: 300,
      backgroundColor: '#ffffff',
      marginTop: 16,
      borderRadius: 12,
      padding: 10,
    },
    flexContainerTall: {
      height: 400,
    },
    flexRow: {
      flexDirection: 'row',
    },
    flexItem: {
      width: 80,
      height: 80,
      margin: 8,
      backgroundColor: '#f2a93b',
      borderRadius: 8,
    },
    wrapItem: {
      width: 150,
      height: 80,
      margin: 8,
      backgroundColor: '#f2a93b',
      borderRadius: 8,
    },
    growItem: {
      height: 80,
      margin: 8,
      backgroundColor: '#f2a93b',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    growLabel: {
      width: '100%',
      height: 80,
      lineHeight: 80,
      fontSize: 36,
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    alignCenter: {
      alignItems: 'center',
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    justifyAround: {
      justifyContent: 'space-around',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    grow1: {
      flexGrow: 1,
      width: 0,
    },
    grow2: {
      flexGrow: 2,
      width: 0,
    },
    nestedCol: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 96,
      height: 180,
      margin: 8,
    },
    nestedBig: {
      width: 180,
      height: 180,
      margin: 8,
      backgroundColor: '#4FC3F7',
      borderRadius: 8,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);
};
