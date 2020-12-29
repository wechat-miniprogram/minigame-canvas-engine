import { SCALE_KEY } from './const.js';
import { RoundRect } from './gl_rect.js';

function none() {

}

function uid() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

const IMAGE_POOL = Object.create(null);

export function createImageLoader(createImage) {
  return function (src, cb = () => {}) {
    if (IMAGE_POOL[src]) {
      if (IMAGE_POOL[src].loaded) {
        cb(IMAGE_POOL[src].image);
      } else {
        IMAGE_POOL[src].onloads.push(cb);
      }
    } else {
      const img = createImage();
      IMAGE_POOL[src] = { image: img, loaded: false, onloads: [cb] };
      img.onload = () => {
        IMAGE_POOL[src].loaded = true;
        IMAGE_POOL[src].onloads.pop()(IMAGE_POOL[src].image, true);
        IMAGE_POOL[src].onloads = [];
      };
      img.onerror = () => {};
      img.src = src;
    }
  };
}

const BGIMAGE_RECT_CACHE = Object.create(null);

function getBgImageRect(
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

const TEXT_TEXTURE = Object.create(null);

export function createTextTexture(createCanvas) {
  return function ([x, y, width, height], { valueShow, valueBreak }, style, dpr = 2) {
    style.font = `${style.fontWeight || ''} ${style.fontSize * dpr}px ${style.fontFamily}`;

    // const key = `${x}_${y}_${width}_${height}_${valueShow}_${style.font}_${style.lineHeight}_${style.textAlign}_${style.textShadow}_${style.whiteSpace}_${style.textOverflow}_${style.color}`;
    const key = `${width}_${height}_${valueShow}_${style.font || '_'}_${style.lineHeight}_${style.textAlign}_${style.textShadow}_${style.whiteSpace}_${style.textOverflow}_${style.color}`;

    if (TEXT_TEXTURE[key]) {
      return TEXT_TEXTURE[key];
    } else {
      console.log(key);
    }

    const canvas = createCanvas();
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

    // console.log(key, drawX, drawY, canvas.toDataURL('image/png'))
    TEXT_TEXTURE[key] = canvas;
    return TEXT_TEXTURE[key];
  };
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

export const VIDEOS = Object.create(null);

const glPool = Object.create(null);

/**
 *
 * @param {CanvasContext} gl
 */
function resetGl(gl) {
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

export function createRender({ dpr, createImage, createCanvas }) {
  const loadImage = createImageLoader(createImage);
  const getTextTexture = createTextTexture(createCanvas);

  function drawOneGlRect(gl, rect, repaintCbk = none) {
    let glRectData = rect.glRectData;

    if (glRectData) {
      glRectData.x = rect.x * dpr;
      glRectData.y = rect.y * dpr;
    } else {
      glRectData = scaleData(rect, dpr);
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
      loadImage(src, (image, lazy) => {
        glRect.setTexture({ image });
        if (lazy) {
          repaintCbk();
        }
      });
    }
    if (glRectData.backgroundImage) {
      const { src, size, position } = glRectData.backgroundImage;
      loadImage(src, (image, lazy) => {
        const rect = getBgImageRect(image, size, position, glRectData.borderWidth || 0, dimension, dpr);
        glRect.setTexture({ image, rect });
        if (lazy) {
          repaintCbk();
        }
      });
    }

    if (glRectData.text) {
      glRect.setTexture({ image: getTextTexture(dimension, glRectData.text.value, glRectData.text.style, dpr) });
    }

    if (glRectData.type === 'Video') {
      const video = VIDEOS[`${gl.canvas.id}-${glRectData.id}`];

      if (video) {
        video.repaint = () => repaintCbk();

        if (video.iData) {
          glRect.setTextureData({ imageData: video.iData, width: video.vWidth, height: video.vHeight });
        }
      }
    }
    glRect.updateViewPort();

    glRect.draw();
  }

  return {
    loadImage,
    resetGl,

    repaint: function drawRects(gl, glRects, scrollGlrects) {
      resetGl(gl);
      glRects.forEach((item, idx) => {
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
          drawOneGlRect(gl, item);

          // 设置模板测试参数，只有滚动窗口内的才进行绘制
          gl.stencilFunc(gl.EQUAL, 1, 1);
          //设置模板测试后的操作
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

          scrollGlrects.forEach(scrollItem => {
            if (   scrollItem.y + scrollItem.height >= item.y
                && scrollItem.y <= item.y + item.height
                && scrollItem.x + scrollItem.width > item.x
                && scrollItem.x <= item.x + item.width  ) {
              drawOneGlRect(gl, scrollItem, () => {
                drawRects(gl, glRects, scrollGlrects);
              });
            }
          });

          // 关闭模板测试
          gl.disable(gl.STENCIL_TEST);
        } else {
          drawOneGlRect(gl, item, () => {
            drawRects(gl, glRects, scrollGlrects);
          })
        }
      });
    },
  };
}

/**
 * 像素点采样检测渲染异常，随机采样count个像素点，如果像素点中超过90%是相同的，则认为是有异常的
 * @param {Object} gl
 * @param {Number} count [采样点的数量]
 */
/*export function renderDetection(gl, count) {
  const { width } = gl.canvas;
  const { height } = gl.canvas;
  let pixels = new Uint8Array(width * height * 3);
  gl.readPixels(0, 0, width, height, gl.RGB, gl.UNSIGNED_BYTE, pixels);

  // const result = [];
  const map = {};
  let maxKey = '';
  for (let i = 0; i < count; i++) {
    const row = Math.random() * width; // 取一行
    const column = Math.random() * height; // 取一列
    const p = 3 * row * width + 3 * column;
    const key = `${pixels[p]}_${pixels[p + 1]}_${pixels[p + 2]}`;
    if (map[key]) {
      map[key] += 1;
      if (map[key] > map[maxKey]) {
        maxKey = key;
      }
    } else {
      map[key] = 1;
    }
  }
  pixels = null;
  if (map[maxKey] / count > 0.9) {
    return false;
  }
  return true;
}*/
