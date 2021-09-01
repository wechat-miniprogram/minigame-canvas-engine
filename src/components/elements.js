import { scalableStyles } from "./style.js";

let Emitter = require("tiny-emitter");

// 全局事件管道
const EE = new Emitter();

let uuid = 0;
let dpr = 1;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function getRgba(hex, opacity) {
  let rgbObj = hexToRgb(hex);

  if (opacity == undefined) {
    opacity = 1;
  }

  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${opacity})`;
}

const toEventName = (event, id) => {
  const elementEvent = [
    "click",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel"
  ];

  if (elementEvent.indexOf(event) !== -1) {
    return `element-${id}-${event}`;
  }

  return `element-${id}-${event}`;
};

export default class Element {
  constructor({
    style = {},
    props = {},
    idName = "",
    className = "",
    id = ++uuid
  }) {
    this.children = [];
    this.childMap = {};
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.style = style;
    this.EE = EE;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};

    if (
      style.opacity !== undefined &&
      style.color &&
      style.color.indexOf("#") > -1
    ) {
      style.color = getRgba(style.color, style.opacity);
    }

    if (
      style.opacity !== undefined &&
      style.backgroundColor &&
      style.backgroundColor.indexOf("#") > -1
    ) {
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity);
    }

    for (let key in this.style) {
      if (scalableStyles.indexOf(key) > -1) {
        this.style[key] *= dpr;
      }
    }

    // 事件冒泡逻辑
    ["touchstart", "touchmove", "touchcancel", "touchend", "click"].forEach(
      eventName => {
        this.on(eventName, (e, touchMsg) => {
          this.parent && this.parent.emit(eventName, e, touchMsg);
        });
      }
    );

    this.initRepaint();
  }

  initRepaint() {
    this.on("repaint", e => {
      this.parent && this.parent.emit("repaint", e);
    });
  }

  // 子类填充实现
  repaint() {}

  // 子类填充实现
  insert() {}

  checkNeedRender() {
    return true;
  }

  // 子类填充实现
  destroy() {
    [
      "touchstart",
      "touchmove",
      "touchcancel",
      "touchend",
      "click",
      "repaint"
    ].forEach(eventName => {
      this.off(eventName);
    });
    this.EE.off("image__render__done");

    this.isDestroyed = true;
    this.EE = null;
    /*this.root          = null;*/
    this.parent = null;
    this.ctx = null;
    this.realLayoutBox = null;
    this.layoutBox = null;
    this.props = null;
    this.style = null;

    if (this.renderBoxes) {
      this.renderBoxes = null;
    }
  }

  add(element) {
    element.parent = this;
    element.parentId = this.id;

    this.children.push(element);
  }

  emit(event, ...theArgs) {
    EE.emit(toEventName(event, this.id), ...theArgs);
  }

  on(event, callback) {
    EE.on(toEventName(event, this.id), callback);
  }

  once(event, callback) {
    EE.once(toEventName(event, this.id), callback);
  }

  off(event, callback) {
    EE.off(toEventName(event, this.id), callback);
  }

  // 方便子类实现borderRadius
  roundRect(ctx, layoutBox) {
    const style = this.style || {};
    const box = layoutBox || this.layoutBox;

    const w = box.width;
    const h = box.height;
    const r = style.borderRadius;
    const x = box.absoluteX;
    const y = box.absoluteY;

    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.clip();
  }

  renderBorder2(ctx, layoutBox) {
    const style = this.style || {};
    const radius = style.borderRadius || 0;
    const { borderWidth = 0 } = style;
    const borderTopLeftRadius = style.borderTopLeftRadius || radius;
    const borderTopRightRadius = style.borderTopRightRadius || radius;
    const borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
    const borderBottomRightRadius = style.borderBottomRightRadius || radius;
    const box = layoutBox || this.layoutBox;
    const borderColor = style.borderColor;
    let x = box.absoluteX;
    let y = box.absoluteY;
    const { width, height } = box;

    if (!borderWidth) {
      return;
    }

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;

    // 左上角的点
    ctx.beginPath();
    ctx.moveTo(x + borderTopLeftRadius, y);
    ctx.lineTo(x + width - borderTopRightRadius, y);

    // 右上角的圆角
    ctx.quadraticCurveTo(x + width, y, x + width, y + borderTopRightRadius);

    // 右下角的点
    ctx.lineTo(x + width, y + height - borderBottomRightRadius);

    // 右下角的圆角
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - borderBottomRightRadius,
      y + height
    );

    // 左下角的点
    ctx.lineTo(x + borderBottomLeftRadius, y + height);

    // 左下角的圆角
    ctx.quadraticCurveTo(x, y + height, x, y + height - borderBottomLeftRadius);

    // 左上角的点
    ctx.lineTo(x, y + borderTopLeftRadius);

    // 左上角的圆角
    ctx.quadraticCurveTo(x, y, x + borderTopLeftRadius, y);
    ctx.stroke();
  }

  // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
  renderBorder(ctx, layoutBox, needStroke = true) {
    const style = this.style || {};

    ctx.save();

    const box = layoutBox || this.layoutBox;
    const borderWidth = style.borderWidth || 0;
    const borderLeftWidth = style.borderLeftWidth || style.borderWidth || 0;
    const borderRightWidth = style.borderRightWidth || style.borderWidth || 0;
    const borderTopWidth = style.borderTopWidth || style.borderWidth || 0;
    const borderBottomWidth = style.borderBottomWidth || style.borderWidth || 0;
    const radius = style.borderRadius || 0;
    const borderColor = style.borderColor;
    let drawX = box.absoluteX;
    let drawY = box.absoluteY;

    ctx.beginPath();

    if (borderColor) {
      if (borderWidth) {
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(drawX, drawY, box.width, box.height);
      }

      if (borderTopWidth && (borderColor || style.borderTopColor)) {
        ctx.lineWidth = borderTopWidth;
        ctx.strokeStyle = style.borderTopColor || borderColor;

        ctx.moveTo(radius ? drawX + radius : drawX, drawY + borderTopWidth / 2);

        ctx.lineTo(
          radius ? drawX + box.width - radius : drawX + box.width,
          drawY + borderTopWidth / 2
        );
      }

      if (borderBottomWidth && (borderColor || style.borderBottomColor)) {
        ctx.lineWidth = borderBottomWidth;
        ctx.strokeStyle = style.borderBottomColor || borderColor;

        ctx.moveTo(
          radius ? drawX + radius : drawX,
          drawY + box.height - borderBottomWidth / 2
        );

        ctx.lineTo(
          radius ? drawX + box.width - radius : drawX + box.width,
          drawY + box.height - borderBottomWidth / 2
        );
      }

      if (borderLeftWidth && (borderColor || style.borderLeftColor)) {
        ctx.lineWidth = borderLeftWidth;
        ctx.strokeStyle = style.borderLeftColor || borderColor;

        ctx.moveTo(
          drawX - borderLeftWidth / 2,
          radius ? drawY + radius : drawY
        );

        ctx.lineTo(
          drawX - borderLeftWidth / 2,
          radius ? drawY + box.height - radius : drawY + box.height
        );
      }

      if (borderRightWidth && (borderColor || style.borderRightColor)) {
        ctx.lineWidth = borderRightWidth;
        ctx.strokeStyle = style.borderRightColor || borderColor;

        ctx.moveTo(
          drawX + box.width - borderRightWidth / 2,
          radius ? drawY + radius : drawY
        );

        ctx.lineTo(
          drawX + box.width - borderRightWidth / 2,
          radius ? drawY + box.height - radius : drawY + box.height
        );
      }
    }

    ctx.closePath();
    if (needStroke) {
      ctx.stroke();
    } else {
      ctx.clip();
    }

    ctx.restore();
  }
}
