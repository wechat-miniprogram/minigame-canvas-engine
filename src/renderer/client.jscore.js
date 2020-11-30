import { setupGl } from './gl_rect.js';
import { createRender, VIDEOS, renderDetection } from './util.js';
import Video from './video';
import VideoDecoder from './video/decoder.jscore.js';
import { performanceReport as pReportor } from '../common/performanceReport.js'

// import { setup2d, repaint } from './2d_rect.js';

// throw new Error();

// 初始化性能上报
pReportor.setOpt({
  uin: 123456,
  pid: 2177,
});

const wx = Object.assign({}, wxCanvas);
//canvas,canvasId不再由native注入
const canvasId = wx.getId();
console.log('init', canvasId);
const canvas = wx.getCanvas();
console.log('CanvasCore', JSON.stringify(CanvasCore))
const cachePath = wx.getCacheDir && wx.getCacheDir();
console.log('cachePath', cachePath);

function createProfiler () {
  if (!NativeGlobal.CpuProfiler) {
    return null;
  }
  return new NativeGlobal.CpuProfiler();
}
function dump(tag, data) {
  return WeixinCore.dump(tag, data);
}

// const profiler = createProfiler();
// if (profiler) {
//   profiler.startProfiling();
//   setTimeout(()=> {
//     const d = JSON.stringify(profiler.stopProfiling());
//     dump('renderCore', d);
//   }, 10000);
// }

function createImage () {
  return new NativeGlobal.Image();
}

function createCanvas() {
  return new NativeGlobal.OffscreenCanvas();
}

function getCurrentVideos() {
  return Object.keys(VIDEOS).filter(k => k.indexOf(`${canvasId}`) === 0).map(key => VIDEOS[key]);
}

function pauseVideos() {
  getCurrentVideos().forEach((video) => {
    if (!video.paused && !video.ended) {
      video._waitPlay = true;
    }
    video.pause();
    video.emit('release');
  });
}

function resetVideos() {
  getCurrentVideos().forEach((video) => {
    if (!video.paused && !video.ended) {
      video._waitPlay = true;
    }
    video.reset();
    video.emit('release');
  });
}

function resumeVideos() {
  getCurrentVideos().forEach((video) => {
    if (video._waitPlay) {
      video.play();
      delete video._waitPlay;
    }
  })
}

const RAFS = new Map();

function requestAnimationFrame(callback) {
  if (!callback) {
    return;
  }
  if (!RAFS.has(callback)) {
    RAFS.set(callback, 1);
  }
  const isOnScreen = wx.isOnScreen();
  if (isOnScreen) {
    callback._rafId = NativeGlobal.requestAnimationFrame(function () {
      if (!RAFS.has(callback)) {
        return
      }
      callback();
    });
  } else if (callback.hasOwnProperty('_rafId')) {
    NativeGlobal.cancelAnimationFrame(callback._rafId);
    delete callback._rafId;
  }

  if (!isOnScreen) { // 不在屏的时候把视频停了
    try {
      pauseVideos();
    } catch (e) {
      console.log('raf release video error!');
      console.error(e);
    }
  }
  return callback;
}

function cancelAnimationFrame(callback) {
  if (!callback) {
    return;
  }
  console.log('cancelAnimationFrame');
  if (callback.hasOwnProperty('_rafId')) {
    NativeGlobal.cancelAnimationFrame(callback._rafId);
    delete callback._rafId;
  }
  if (RAFS.has(callback)) {
    RAFS.delete(callback);
  }
}

function resumeRafs() {
  RAFS.forEach((id, callback) => {
    if (!callback.hasOwnProperty('_rafId')) {
      console.log('resume requestAnimationFrame');
      callback._rafId = NativeGlobal.requestAnimationFrame(callback);
    }
  });
}

function pauseRafs() {
  RAFS.forEach((id, callback) => {
    if (callback.hasOwnProperty('_rafId')) {
      console.log('pause cancelAnimationFrame');
      NativeGlobal.cancelAnimationFrame(callback._rafId);
      delete callback._rafId;
    }
  });
}

Video.Decoder = VideoDecoder;
Video.requestAnimationFrame = requestAnimationFrame;
Video.cancelAnimationFrame = cancelAnimationFrame;
const dpr = NativeGlobal.getSystemInfo().pixelRatio;
const renderer = createRender({
  dpr,
  createImage,
  createCanvas
});

// 标记下首次收到的渲染数据，用于骨架屏的恢复
let firstRender = true;
let frameData;
CanvasCore.native.addCanvasEventListener(`render://client/${canvasId}`, 'message', (event) => {
  if (event.data) {
// CanvasCore.native.addEventListener('message', (event) => {
  console.log('message from main ', canvasId, event.target == `render://client/${canvasId}`, JSON.stringify(event));
  // if (event.data && event.target == `render://client/${canvasId}`) {
    const e = event.data;
    if (e.type === 'render') { // 由js线程抛过来的渲染事件
      pReportor.saveSpeeds({
        sid: 34,
        time: Date.now() - e.start // render事件在线程间通信耗时
      });
      wx.setHeight(e.data.height);
      //TODO 需要前端透传start
      draw(e.data, e.start);
      if (firstRender) {
        // if (e.data.height > 0) { // daisy的频道入口的onCreate是异步函数，导致第一次计算出来的布局高度为0，因为computeLayout比业务的init先执行。
        //   firstRender = false;
        // }
        firstRender = false;
        // console.log('card height ' + e.data.height);
      }
      console.log(`render now:${wx.getHeight()} to: ${e.data.height}`);
    }

    if (e.type === 'setCardType') {
      console.log(`setCardType: ${e.data}`);
      // wx.setCardType(e.data); // 设置卡片类型
    }

    if (e.type === 'video-pos') {
      const { size } = e.data;
      wx.setVideo(size.y, size.y + size.height); // top & bottom
    }

    if (e.type === 'video-ctrl') { // 视频相关的事件
      const key = `${canvasId}-${e.data.id}`
      if (e.data.op === 'play') {
        const { source, muted, cachePath } = e.data;
        console.log(`client video play: ${JSON.stringify(e.data)}`);

        if (!VIDEOS[key]) {
          VIDEOS[key] = new Video({
            source,
            muted,
            cachePath
          })
          const VIDEO_EVENTS = ['timeupdate', 'ended', 'release', 'error']
          VIDEO_EVENTS.forEach(name => {
            VIDEOS[key].on(name, (payload) => {
              CanvasCore.native.postMessage({
                type: 'video-event',
                name: name,
                payload
              }, `context://client/${canvasId}`);
              // if (name === 'ended') {
              //   setTimeout(() => {
              //     if (!VIDEOS[key].ended) {
              //       wx.setCardType(0); // 如果没有再播就设置为普通卡
              //     }
              //   }, 200);
              // }
            })
          })
        }

        console.log(`isOnScreen: ${wx.isOnScreen()}`);
        console.log(`canVideoAutoPlay: ${wx.canVideoAutoPlay()}`);

        if (!wx.isOnScreen() || !wx.canVideoAutoPlay()) { // 不在屏或不在热区都不播放
          console.log('can not play!');
          VIDEOS[key]._waitPlay = true;
          return;
        }
      }

      if (e.data.op && VIDEOS[key] && VIDEOS[key][e.data.op]) {
        VIDEOS[key][e.data.op](e.data.payload);
      }
    }

    if (e.type === 'preload-image') { // 预加载图片
      renderer.loadImage(e.data.src);
    }
  }
});

// 客户端上屏
CanvasCore.native.addCanvasEventListener(canvasId, 'repaintNextFrame', (event) => {
    console.log('repaintNextFrame', canvasId);
    NativeGlobal.requestAnimationFrame(()=>{
      if (wx.isOnScreen() && frameData && !frameData.noRepaint && (event.target == '*' || event.target == canvasId)) {
        draw(frameData);
        console.log('repaintNextFrame', canvasId);
      }
    })
});

CanvasCore.native.addCanvasEventListener(canvasId, 'repaint', (event) => {
  console.log('render receive repaint. isOnScreen=', wx.isOnScreen());
  if (wx.isOnScreen() && frameData && !frameData.noRepaint) {
    console.log('repaint frameData=', JSON.stringify(frameData), event.target);
    draw(frameData, event.start);
    console.log(`repaint:${Date.now() - event.start}ms`);
    NativeGlobal.requestAnimationFrame(()=>{
      //TODO 增加客户端监控
      pReportor.saveSpeeds({
        sid: 32,
        time: Date.now() - event.start
      });
      console.log(`repaint raf:${Date.now() - event.start}ms`);
    });
  }
});

// todo 客户端退出tl事件
CanvasCore.native.addEventListener('stop', (event) => {
  if (event.target == '*' || event.target == canvasId) {
    if (!wx.isOnScreen()) {
      pauseRafs();
    }
    resetVideos();
  }
  console.log('render stop', event.target);
});

// datach 视频停止回到第一帧
CanvasCore.native.addEventListener('detach', (event) => {
  if (event.target == canvasId) {
    resetVideos();
  }
  console.log('render datach', event.target);
});

// 停掉raf
CanvasCore.native.addCanvasEventListener(canvasId, 'pause', (event) => {
  pauseRafs();
  pauseVideos();
  console.log('pauseRaf', event.target);
});

// 恢复raf
CanvasCore.native.addCanvasEventListener(canvasId, 'resume', (event) => {
  if (wx.isOnScreen()) {
    resumeRafs();
    if (wx.canVideoAutoPlay()) {
      resumeVideos();
    }
  }
  console.log('resumeRaf', event.target)
});

CanvasCore.native.addCanvasEventListener(canvasId, 'enterHotZone', function (event) {
  const isOnScreen = wx.isOnScreen();
  if (isOnScreen) {
    resumeRafs();
    resumeVideos();
  }
  console.log('enterHotZone, isOnScreen: ', isOnScreen);
})

CanvasCore.native.addCanvasEventListener(canvasId, 'exitHotZone', function (event) {
  if (!wx.isOnScreen()) {
    pauseRafs();
  }

  console.log(`${canvasId} exitHotZone`);
  pauseVideos();
});

function draw(data, start) {
  console.log('draw');
  frameData = data;
  // console.log('frameData', canvas, JSON.stringify(frameData));
  const gl = setupGl(canvas);
  // const ctx = setup2d(canvas);
  //窗口和逻辑不一定绝对匹配，popup会被系统裁剪
  const wxWidth = parseInt(wx.getWidth() * dpr);
  const wxHeight = parseInt(wx.getHeight() * dpr);

  const dataWidth = parseInt(frameData.width * dpr);
  const dataHeight = parseInt(frameData.height * dpr);
  let needUpdateViewPort = false;
  // console.log('testRun dpr: ' + dpr);
  console.log(`${frameData.width} ${frameData.height}`);
  gl.canvas.id = canvasId;
  
  if (wxWidth === 0 || wxHeight === 0) { // 容器还没有宽高时用frameData宽高
    if (dataWidth > 0 && gl.canvas.width !== dataWidth) {
      gl.canvas.width = dataWidth;
      needUpdateViewPort = true;
    }
    if (dataHeight > 0 && gl.canvas.height !== dataHeight) {
      gl.canvas.height = dataHeight;
      needUpdateViewPort = true;
    }
  } else {
    if (wxWidth > 0 && gl.canvas.width !== wxWidth) {
      gl.canvas.width = wxWidth;
      needUpdateViewPort = true;
    }
    if (wxHeight > 0 && gl.canvas.height !== wxHeight) {
      gl.canvas.height = wxHeight;
      needUpdateViewPort = true;
    }
  }
  if (needUpdateViewPort) { // 减少没必要的调用，优化执行的性能
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
  console.log(`wx [width, height]: ${wxWidth} ${wxWidth}`);
  console.log(`canvas [width, height]: ${canvas.width} ${canvas.height}`);
  renderer.repaint(gl, frameData.glRects);

  // if (start > 0) {
  //   NativeGlobal.requestAnimationFrame(()=>{
  //     //提交首屏渲染
  //     console.log(`raf draw ${Date.now() - start}`)
  //   })
  // }
  NativeGlobal.requestAnimationFrame(() => {
    if (start > 0) {
      //提交首屏渲染
      console.log(`raf draw ${Date.now() - start}`)
    }
    const renderResult = renderDetection(gl, 30); // 随机取30个点，看看有没有问题
    if (!renderResult) { // 渲染有问题，需要上报
      console.info('renderDetection error');
      CanvasCore.errReport({
        name: 'renderError'
      });
    }
  });
}

function drawSkeleton() {
  // 拿到render线程启动的时候的状态
  // const fontSize = wx.getFontSize();
  // const isDarkMode = wx.isDarkMode();
  // const screenWidth = wx.getWidth();

  // 根据canvasId拿到之前的渲染数据
  const stime = Date.now();
  let skeletonData = wx.restore(canvasId);
  if (skeletonData) {
    skeletonData = JSON.parse(skeletonData);
    if (skeletonData.glRects && skeletonData.glRects.length) {
      console.log('has skeletonData!!!');
      // console.log(skeletonData);
      draw(skeletonData);
      pReportor.saveSpeeds({
        sid: 33,
        time: Date.now() - stime
      });
    }
  }
}

// load完文件就可以直接画了
drawSkeleton();
