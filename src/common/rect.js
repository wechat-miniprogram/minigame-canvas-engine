
export default class Rect {
  width = 0;
  height = 0;
  left = 0;
  right = 0;
  top = 0;
  bottom = 0;

  constructor(left = 0, top = 0, width = 0, height = 0) {
    this.set(left, top, width, height);
  }

  set(left = 0, top = 0, width = 0, height = 0) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;

    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  /**
   * 判断两个矩形是否相交
   * 原理可见: https://zhuanlan.zhihu.com/p/29704064
   */
  intersects(rect) {
    return !(this.right < rect.left || rect.right < this.left || this.bottom < rect.top || rect.bottom < this.top);
  }
}
