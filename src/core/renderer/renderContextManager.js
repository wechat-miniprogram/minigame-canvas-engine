import { setupGl } from '../../renderer/gl_rect.js';
import { createRender, VIDEOS, renderDetection } from '../../renderer/util.js';


import { createImage } from '../common/util'
const { wx } = pluginEnv.customEnv;

/**
 * @description 逻辑线程渲染管理器，用于搜集每个节点需要的渲染数据
 */
import RenderContext from './renderContext'


function createCanvas() {
  return wx.createCanvas();
}

let renderer;
export default class RenderContextManager {
  constructor(canvasContext, scale = 1) {
    this.canvasContext = canvasContext;
    this.glRects = [];
    this.scale = scale;

    renderer = createRender({
      dpr: scale,
      createImage,
      createCanvas
    });

    this.layout = null;
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
    this.testRun({
        noRepaint: !!this.noRepaint,
        width: this.width,
        height: this.height,
        glRects: this.glRects
    }, this.canvasContext.canvas)

  }

  testRun(data, canvas) {
    const gl = setupGl(canvas);
    gl.canvas.height = data.height;
    gl.canvas.width = data.width;
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    // renderer.repaint(gl, data.glRects);

    renderer.resetGl(gl);
    
    renderer.repaintTree(gl, this.layout.childNodes[0]);

    // const result = renderDetection(gl, 30);
    // console.log(`render detection ${result}`);
  }
}
