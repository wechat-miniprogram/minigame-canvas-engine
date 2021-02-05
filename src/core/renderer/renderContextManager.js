import { setupGl, releaseGl } from '../../renderer/gl_rect.js';
import Renderer from '../../renderer/util.js';

import {
  createImage,
  createCanvas
} from '../common/util'

/**
 * @description 逻辑线程渲染管理器，用于搜集每个节点需要的渲染数据
 */
import RenderContext from './renderContext'

export default class RenderContextManager {
  constructor(canvasContext, scale = 1, imgPool) {
    this.canvasContext = canvasContext;
    this.glRects = [];

    this.width = 0;
    this.height = 0;

    this.renderer = new Renderer({
      dpr: scale,
      createImage,
      createCanvas,
      imgPool
    });

    this.layout = null;

    this.hasSetup = false;
    this.gl = null;
    this.hasScroll = false;
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
    this.glRects = [];
    this.scrollGlrects = [];
  }

  release() {
    Renderer.release();
    this.clear();

    if (this.gl) {
      releaseGl(this.gl);
    }
  }

  getChildrenGlRects(node, res = []) {
    if (node !== this.layout.scrollview && node.glRect) {
      const index = this.glRects.indexOf(node.glRect);
      this.glRects.splice(index, 1);
      res.push(node.glRect)
    }

    node.children.forEach(child => {
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

      const gl = setupGl(this.canvasContext.canvas, false);
      gl.canvas.height = this.height;
      gl.canvas.width = this.width;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      this.gl = gl;
      this.renderer.gl = gl;

      if (this.layout.scrollview) {
        this.hasScroll = true;

        this.scrollGlrects = [];
        this.getChildrenGlRects(this.layout.scrollview, this.scrollGlrects);
      }
    }

    this.renderer.repaint(this.gl, this.glRects, this.scrollGlrects);
  }
}
