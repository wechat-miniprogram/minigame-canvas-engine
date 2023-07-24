import Layout from "./engine.js";
let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext("2d");

const style = {
  container: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    width: 150,
    height: 150,
    // borderRadius: 75,
    transform: 'rotate(45deg)',
    borderWidth: 1,
    backgroundColor: 'red'
  },
};

const tpl = `
<view id="container">
  <image src="sub/images/loading.png" id="loading"></image>
</view>
`;

export function showLoading() {
  Layout.clear();
  Layout.init(tpl, style);
  Layout.layout(sharedContext);

  const image = Layout.getElementById('loading');
  let degrees = 0;
  Layout.ticker.add(() => {
    degrees = (degrees + 2) % 360;
    image.style.transform = `rotate(${degrees}deg)`;        
  });
}
