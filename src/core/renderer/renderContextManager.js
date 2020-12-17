import {
  setupGl
} from '../../renderer/gl_rect.js';
import {
  createRender,
  VIDEOS,
  renderDetection
} from '../../renderer/util.js';


import {
  createImage
} from '../common/util'
const {
  wx
} = pluginEnv.customEnv;

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

    this.width = 0;
    this.height = 0;

    renderer = createRender({
      dpr: scale,
      createImage,
      createCanvas
    });

    this.layout = null;

    this.scrollRenderer = createRender({
      dpr: scale,
      createCanvas,
      createImage
    });
    this.scrollCanvas = createCanvas();

    this.hasSetup = false;
    this.gl = null;
    this.scrollGl = null;
    this.hasScroll = false;
  }

  setupScrollGl() {

    const gl = setupGl(this.scrollCanvas);
    gl.canvas.height = this.height;
    gl.canvas.width = this.width;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    this.scrollGl = gl;

    this.layout.scrollview.glRect.glTexture = this.scrollCanvas;
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
    // console.log('clear call');
    this.glRects = this.glRects.slice(0, 0);
  }

  getChildrenGlRects(node, res = []) {
    if (node !== this.layout.scrollview && node.glRect) {
      const index = this.glRects.indexOf(node.glRect);
      this.glRects.splice(index, 1);
      res.push(node.glRect)
    }

    node.childNodes.forEach(child => {
      this.getChildrenGlRects(child, res);
    });

    return res;
  }

  /**
   * @description 传递数据给渲染线程
   */
  draw(needInit = false) {
    if (!this.hasSetup || needInit) {
      this.hasSetup = true;

      const gl = setupGl(this.canvasContext.canvas);
      gl.canvas.height = this.height;
      gl.canvas.width = this.width;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      this.gl = gl;

      if (this.layout.scrollview) {
        this.hasScroll = true;
        this.setupScrollGl();

        this.scrollGlrects = [];
        this.getChildrenGlRects(this.layout.scrollview, this.scrollGlrects);
      }
    }

    if (this.hasScroll) {
      // scrollview重绘
      renderer.repaint(this.scrollGl, this.scrollGlrects);
    }


    // 除了scrollview之外的glRects重绘
    renderer.repaint(this.gl, this.glRects);
  }
}
