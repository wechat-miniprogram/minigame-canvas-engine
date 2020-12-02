import { setupGl } from '../../renderer/gl_rect.js';
import { createRender, VIDEOS, renderDetection } from '../../renderer/util.js';

const {WXWebAssembly, wx} = pluginEnv.customEnv;

/**
 * @description 逻辑线程渲染管理器，用于搜集每个节点需要的渲染数据
 */
import RenderContext from './renderContext'

function createImage() {
  /* istanbul ignore if*/
  if ( typeof wx !== "undefined" ) {
    return wx.createImage();
  } else {
    return document.createElement('img');
  }
}

function createCanvas() {
  return wx.createCanvas();
}

const info = wx.getSystemInfoSync();

const dpr = info.devicePixelRatio;
const renderer = createRender({
  dpr,
  createImage,
  createCanvas
});

export default class RenderContextManager {
  constructor(canvasContext) {
    this.canvasContext = canvasContext;
    this.glRects = [];
  }
  createRoundRect(id, type) {
    const glRect = new RenderContext(id, type);
    this.glRects.push(glRect);
    return glRect;
  }
  /**
   * @description 清空数据
   */
  clear() {
    console.log('clear call');
    this.glRects = this.glRects.slice(0, 0);
  }
  /**
   * @description 传递数据给渲染线程
   */
  draw() {
    console.log('draw in RenderContextManager');
    // console.log(this.glRects, JSON.stringify(this.glRects));
    // const elementId = this.canvasContext.elementId;
    /*this.canvasContext.postMessage({
      type: 'render',
      data: {
        noRepaint: !!this.noRepaint,
        width: this.width,
        height: this.height,
        glRects: this.glRects
      },
      start: Date.now(), // 传递时间，看看线程间通信的耗时
    });
*/
    this.testRun({
        noRepaint: !!this.noRepaint,
        width: this.width,
        height: this.height,
        glRects: this.glRects
    }, this.canvasContext.canvas)
  }

  testRun(data, canvas) {
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
}
