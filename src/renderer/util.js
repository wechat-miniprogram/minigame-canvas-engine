import { SCALE_KEY } from './const.js';
import { RoundRect} from './gl_rect.js';
import { getImageRect } from './canvas-object-fit.js'

function none() {}

function uid() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 处理渲染相关数据的分辨率
 * @param {Object} data [render数据]
 * @param {Number} dpr [分辨率]
 */
function scaleData(data, dpr) {
  const newData = Object.assign({}, data);
  SCALE_KEY.forEach((key) => {
    if (typeof newData[key] === 'number') {
      newData[key] *= dpr;
    } else if (Array.isArray(newData[key])) {
      newData[key] = newData[key].map(v => v * dpr);
    }
  });

  return newData;
}


let glPool = Object.create(null);
let TEXT_TEXTURE = Object.create(null);
let BGIMAGE_RECT_CACHE = Object.create(null);

export default class Renderer {
  constructor({ dpr, createImage, createCanvas, imgPool }) {
    this.createImage = createImage;
    this.createCanvas = createCanvas;
    this.dpr = dpr;
    this.imgPool = imgPool;

    this.gl = null;
  }

  static release() {
    TEXT_TEXTURE = {};
    BGIMAGE_RECT_CACHE = {};

    Object.getOwnPropertyNames(glPool).forEach(function(key){
      glPool[key].destroy();

      delete glPool[key];
    });

    glPool = {};
  }

  getTextTexture([x, y, width, height], { valueShow, valueBreak }, style, dpr = 2) {
    style.font = `${style.fontWeight || ''} ${style.fontSize * dpr}px ${style.fontFamily}`;

    const key = `${width}_${height}_${valueShow}_${style.font || '_'}_${style.lineHeight}_${style.textAlign}_${style.textShadow}_${style.whiteSpace}_${style.textOverflow}_${style.color}`;

    if (TEXT_TEXTURE[key]) {
      return TEXT_TEXTURE[key];
    }

    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');

    canvas.width = Math.ceil(width);
    canvas.height = Math.ceil(height);

    ctx.save();

    ctx.textBaseline = 'top';
    ctx.font = style.font;
    ctx.textAlign = style.textAlign;
    ctx.fillStyle = style.color;

    if (style.textShadow) {
      const [offsetX, offsetY, shadowBlur, shadowColor] = style.textShadow.split(' ');
      ctx.shadowOffsetX = +offsetX * dpr;
      ctx.shadowOffsetY = +offsetY * dpr;
      ctx.shadowBlur = +shadowBlur * dpr;
      ctx.shadowColor = shadowColor;
    }

    let drawX = 0;
    let drawY = style.drawY * dpr - y;

    if (style.textAlign === 'center') {
      drawX += width / 2;
    } else if (style.textAlign === 'right') {
      drawX += width;
    }

    if (style.lineHeight) {
      ctx.textBaseline = 'middle';
      drawY += (style.lineHeight * dpr) / 2;
    }

    if (style.whiteSpace === 'nowrap' && style.textOverflow !== 'ellipsis') { // 不换行的时候，直接溢出处理
      ctx.fillText(
        valueShow,
        drawX,
        drawY,
      );
    } else {
      if (valueBreak && valueBreak.length) {
        for (let i = 0; i < valueBreak.length; i++) {
          const str = valueBreak[i];
          ctx.fillText(str, drawX, drawY);
          drawY += (style.lineHeight || style.fontSize) * dpr;
        }
      } else {
        ctx.fillText(
          valueShow,
          drawX,
          drawY,
        );
      }
    }
    ctx.restore();

    TEXT_TEXTURE[key] = canvas;

    return TEXT_TEXTURE[key];
  }

  /**
   *
   * @param {CanvasContext} gl
   */
  resetGl(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    {
      gl.enable(gl.BLEND);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    }

    { // VBO
      // bufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.program.bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, gl.program.positions, gl.STATIC_DRAW);
      gl.vertexAttribPointer(gl.program.vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(gl.program.vPosition);
    }
  }

  loadImage(src, cb = none) {
    if (this.imgPool[src]) {
      if (this.imgPool[src].loaded) {
        cb(this.imgPool[src].image);
      } else {
        /*console.log('load img in render', src);*/
        this.imgPool[src].onloads.push(cb);
      }
    } else {
      const img = this.createImage();
      this.imgPool[src] = { image: img, loaded: false, onloads: [cb] };

      img.onload = () => {
        this.imgPool[src].loaded = true;
        this.imgPool[src].onloads.pop()(this.imgPool[src].image, true);
        this.imgPool[src].onloads = [];
      };
      img.onerror = () => {};
      img.src = src;
    }
  }

  getBgImageRect(
    { src, width, height },
    size,
    position,
    borderWidth,
    [baseX, baseY, boxWidth, boxHeight],
    dpr = 2
  ) {
    const key = `${src}_${size}_${position}_${borderWidth}_${baseX}_${baseY}_${boxWidth}_${boxHeight}`;

    if (BGIMAGE_RECT_CACHE[key]) {
      return BGIMAGE_RECT_CACHE[key];
    }

    let finalX = baseX - borderWidth;
    let finalY = baseY - borderWidth;

    if (size) {
      const splitVal = size.split(' ');
      if (splitVal.length === 2) {
        const setWidth = splitVal[0];
        const setHeight = splitVal[1];
        width = setWidth[setWidth.length - 1] === '%' ? (boxWidth * parseFloat(setWidth.slice(0, -1))) / 100 : parseFloat(setWidth) * dpr;
        height = setHeight[setHeight.length - 1] === '%' ? (boxHeight * parseFloat(setHeight.slice(0, -1))) / 100 : parseFloat(setHeight) * dpr;
      } else if (splitVal.length === 1) {
        const imgRatio = width / height;
        const boxRatio = boxWidth / boxHeight;
        switch (splitVal[0]) {
          case 'contain':
            if (imgRatio < boxRatio) {
              height = boxHeight;
              width = height * imgRatio;
              if (!position) {
                finalY = baseY;
                finalX = baseX + (boxWidth - width) / 2;
              }
            } else {
              width = boxWidth;
              height = width / imgRatio;
              if (!position) {
                finalX = baseX;
                finalY = baseY + (boxHeight - height) / 2;
              }
            }
            break;
          case 'cover':
            if (imgRatio < boxRatio) {
              width = boxWidth;
              height = width / imgRatio;
              if (!position) {
                finalX = baseX;
                finalY = baseY - (height - boxHeight) / 2;
              }
            } else {
              height = boxHeight;
              width = height * imgRatio;
              if (!position) {
                finalY = baseY;
                finalX = baseX - (width - boxWidth) / 2;
              }
            }
            break;
        }
      }
      if (position) {
        let [x, y] = position.split(' ');
        switch (x) {
          case 'left':
            x = '0%';
            break;
          case 'center':
            x = '50%';
            break;
          case 'right':
            x = '100%';
        }
        switch (y) {
          case 'top':
            y = '0%';
            break;
          case 'center':
            y = '50%';
            break;
          case 'bottom':
            y = '100%';
        }
        x = x[x.length - 1] === '%' ? ((boxWidth - width) * parseFloat(x.slice(0, -1))) / 100 : parseFloat(x) * dpr;
        y = y[y.length - 1] === '%' ? ((boxHeight - height) * parseFloat(y.slice(0, -1))) / 100 : parseFloat(y) * dpr;
        finalX += x;
        finalY += y;
      }
    }

    BGIMAGE_RECT_CACHE[key] = [finalX - baseX, finalY - baseY, width, height];

    return BGIMAGE_RECT_CACHE[key];
  }

  drawOneGlRect(gl, rect) {
    let glRectData = rect.glRectData;
    let dpr = this.dpr;

    if (glRectData) {
      glRectData.x = rect.x * dpr;
      glRectData.y = rect.y * dpr;
    } else {
      glRectData = scaleData(rect, this.dpr);
      rect.glRectData = glRectData;
    }

    if (!rect.uid) {
      rect.uid = uid();
    }

    const dimension = [glRectData.x, glRectData.y, glRectData.width, glRectData.height];
    let glRect = glPool[rect.uid];
    if (!glRect) {
      glRect = new RoundRect(gl);
      glPool[rect.uid] = glRect;
    } else {
      glRect.reset();
    }

    glRectData.radius && glRect.setRadius(glRectData.radius);
    glRectData.backgroundColor && glRect.setBackgroundColor(glRectData.backgroundColor);
    glRectData.borderWidth && glRect.setBorder(glRectData.borderWidth, glRectData.borderColor);
    glRectData.opacity && glRect.setOpacity(glRectData.opacity);
    glRect.updateContours(dimension);

    if (glRectData.image) {
      const { src } = glRectData.image;
      if (this.imgPool[src] && this.imgPool[src].loaded) {
        let image = this.imgPool[src].image;
        if (rect.objectFit) {
          const rect = getImageRect(image, 0, 0, glRectData.width, glRectData.height, {objectFit: 'cover'});
          glRect.setTexture({ image, srcRect:rect});
        } else {
          glRect.setTexture({image});
        }
      }
    }

    if (glRectData.backgroundImage) {
      const { src, size, position } = glRectData.backgroundImage;

      if (this.imgPool[src] && this.imgPool[src].loaded) {
        const rect = getBgImageRect(this.imgPool[src].image, size, position, glRectData.borderWidth || 0, dimension, dpr);
        glRect.setTexture({ image: this.imgPool[src].image, rect });
      }
    }

    if (glRectData.text) {
      glRect.setTexture({ image: this.getTextTexture(dimension, glRectData.text.value, glRectData.text.style, dpr) });
    }

    glRect.updateViewPort();

    glRect.draw();
  }

  repaint(gl, glRects, scrollGlrects) {
    this.resetGl(gl);
    glRects.forEach((item) => {
      if (item.image && (!this.imgPool[item.image.src] || !this.imgPool[item.image.src].loaded)) {
        this.loadImage(item.image.src, () => {
          this.repaint(gl, glRects, scrollGlrects);
        });
      }

      // scrollview开启模板测试
      if (item.type === 'ScrollView') {
        // 清除模板缓存
        gl.clear(gl.STENCIL_BUFFER_BIT);
        // 开启模板测试
        gl.enable(gl.STENCIL_TEST);

        // 设置模板测试参数
        gl.stencilFunc(gl.ALWAYS, 1, 1);
        // 设置模板值操作
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        // 绘制scrollview
        this.drawOneGlRect(gl, item);

        // 设置模板测试参数，只有滚动窗口内的才进行绘制
        gl.stencilFunc(gl.EQUAL, 1, 1);
        //设置模板测试后的操作
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        scrollGlrects.forEach(scrollItem => {
          if (scrollItem.image && (!this.imgPool[scrollItem.image.src] || !this.imgPool[scrollItem.image.src].loaded)) {
            this.loadImage(scrollItem.image.src, () => {
              this.repaint(gl, glRects, scrollGlrects);
            });
          }
          if ( scrollItem.y + scrollItem.height >= item.y
            && scrollItem.y <= item.y + item.height
            && scrollItem.x + scrollItem.width > item.x
            && scrollItem.x <= item.x + item.width  ) {
            this.drawOneGlRect(gl, scrollItem);
          }
        });

        // 关闭模板测试
        gl.disable(gl.STENCIL_TEST);
      } else {
        this.drawOneGlRect(gl, item)
      }
    });
  }
}

