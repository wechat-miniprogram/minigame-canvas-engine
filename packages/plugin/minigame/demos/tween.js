var TWEEN = require('./lib/tween');

module.exports = function tween(Layout, canvas, ctx) {
  const W = canvas.width;
  const H = canvas.height;

  // 用一个居中的小区域做动画场景
  const SCENE_W = 500;
  const SCENE_H = 800;

  const tpl = `
    <view id="container">
      <view class="scene">
        <view class="ball"></view>
      </view>
    </view>
  `;

  const ballSize = 100;
  const style = {
    container: {
      width: W,
      height: H,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scene: {
      width: SCENE_W,
      height: SCENE_H,
      backgroundColor: '#f3f3f3',
      alignItems: 'center',
      borderRadius: 20,
    },
    ball: {
      backgroundColor: '#3498db',
      width: ballSize,
      height: ballSize,
      borderRadius: ballSize / 2,
      top: 0,
    },
    bigBall: {
      backgroundColor: '#e74c3c',
      width: 160,
      height: 160,
    },
  };

  Layout.init(tpl, style);
  Layout.layout(ctx);

  const ball = Layout.getElementsByClassName('ball')[0];

  ball.on('click', () => {
    if (ball.classList.contains('bigBall')) {
      ball.classList.remove('bigBall');
    } else {
      ball.classList.add('bigBall');
    }
  });

  Layout.ticker.add(() => {
    TWEEN.update();
  });

  new TWEEN.Tween(ball.style)
    .to({ top: SCENE_H - ballSize - 40 }, 2000)
    .easing(TWEEN.Easing.Bounce.Out)
    .yoyo(true)
    .repeat(Infinity)
    .start();
};
