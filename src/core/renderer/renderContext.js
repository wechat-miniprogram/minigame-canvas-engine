import rgba from 'color-rgba'

function cached(fn) {
  const cache = Object.create(null)
  return (function cachedFn(str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}
// 格式化颜色数据
const normalizeColor = cached(function (color) {
  return rgba(color).map((c, i) => {
    if (i === 3) {
      return c;
    }
    return c / 255;
  });
})

/**
 * @description 每个组件对应的渲染数据
 */
export default class RenderContext {
  constructor(id, type) {
    this.id = id;
    this.type = type;
    this.opacity = 1;
  }
  updateContours([x, y, width, height]) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.originX = x;
    this.originY = y;
    
  }

  setOpacity(v) {
    this.opacity = v;
  }

  setRadius(r) {
    if (typeof r === 'number') {
      this.radius = [r, r, r, r];
    } else {
      this.radius = r;
    }
  }
  setBorder(width, color) {
    this.borderWidth = width;
    this.borderColor = normalizeColor(color);
  }
  setBackgroundColor(color) {
    this.backgroundColor = normalizeColor(color);
  }
  setTexture(texture) {
    this.texture = texture;
    console.log(texture, texture.type)
  }
  setImage(src, rect, srcRect) {
    this.image = { src, rect, srcRect }
  }
  setBackgroundImage(src, size, position) {
    this.backgroundImage = { src, size, position }
  }
  setText(text) {
    this.text = text;
  }
  reset() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.radius = [0, 0, 0, 0];
    this.borderWidth = 0;
    this.borderColor = [0, 0, 0, 0];
    this.backgroundColor = [0, 0, 0, 0];
    this.texture = null;
    this.image = null;
    this.backgroundImage = null;
    this.text = null;
  }
}
