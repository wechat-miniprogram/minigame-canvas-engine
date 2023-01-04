// import './libs/adapter/index';
// import App from './src/index.js';

// new App();

const info        = wx.getSystemInfoSync();
const scale       = 3;
const GAME_WIDTH  = info.windowWidth * scale;
const GAME_HEIGHT = info.windowHeight * scale;

let canvas;
let ctx;

let flag = false;
let x, y;

canvas = wx.createCanvas();
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
ctx = canvas.getContext('2d');

function initSharedCanvas() {
  const openDataContext = wx.getOpenDataContext();
  const sharedCanvas    = openDataContext.canvas;
  
  // 中间挖了个坑用填充排行榜
  sharedCanvas.width  = 960;
  sharedCanvas.height = 1410;
  
  const realWidth  = sharedCanvas.width / GAME_WIDTH * info.windowWidth;
  const realHeight = sharedCanvas.height / GAME_HEIGHT * info.windowHeight;
  // console.log(realHeight, realWidth)
  openDataContext.postMessage({
      event: 'updateViewPort',
      box       : {
          width  : realWidth,
          height : realHeight,
          x      : ( info.windowWidth - realWidth ) / 2,
          y      : ( info.windowHeight - realHeight ) / 2,
      }
  });
  
  openDataContext.postMessage({
    event: 'showFriendRank',
  });
  
  x = GAME_WIDTH / 2 - sharedCanvas.width / 2;
  y = GAME_HEIGHT / 2 - sharedCanvas.height / 2;
  
  flag = true;
}

function loop() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
  if (flag) {
    ctx.drawImage(sharedCanvas, x, y, sharedCanvas.width, sharedCanvas.height)
  }

  requestAnimationFrame(loop)
}

loop()

// wx.onTouchStart((result) => {
//   initSharedCanvas();
// })

initSharedCanvas();
