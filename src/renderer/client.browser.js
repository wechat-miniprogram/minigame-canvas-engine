import { setupGl } from './gl_rect.js';
import { createRender, VIDEOS, renderDetection } from './util.js';
import Video from './video';
import VideoDecoder from './video/decoder.browser.js';

// import { setup2d, repaint } from './2d_rect.js';

function createImage () {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.setSrc = (src) => img.src = src;
  return img;
}

function createCanvas() {
  return document.createElement('canvas');
}

Video.Decoder = VideoDecoder;
Video.requestAnimationFrame = window.requestAnimationFrame.bind(window);
Video.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
const dpr = window.devicePixelRatio;
const renderer = createRender({
  dpr,
  createImage,
  createCanvas
});

function testRun(data, canvas) {
  console.log('data', data);
  const gl = setupGl(canvas);
  // const gl = setup2d(canvas);
  gl.canvas.height = data.height * dpr;
  gl.canvas.width = data.width * dpr;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  renderer.repaint(gl, data.glRects);
  const result = renderDetection(gl, 30);
  console.log(`render detection ${result}`);
  // repaint(gl, data.glRects, dpr);
}

CanvasCore.native.addEventListener('message', (event) => {
  if (event.data && event.target) {
    const e = event.data;

    if (e.type === 'render' && e.data.glRects && e.data.glRects.length > 0) {
      testRun(e.data, event.target);
    }

    if (e.type === 'video-ctrl') {
      const key = `${event.target.id}-${e.data.id}`
      if (e.data.op === 'play') {
        const { source, muted, cachePath } = e.data;

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
              }, `context://client/${event.target.id}`);
            })
          })
        }
      }

      if (e.data.op && VIDEOS[key] && VIDEOS[key][e.data.op]) {
        VIDEOS[key][e.data.op](e.data.payload);
      }
    }

    if (e.type === 'preload-image') {
      renderer.loadImage(e.data.src);
    }
  }
});
