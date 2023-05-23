
export default class Rect {
  public width = 0;
  public height = 0;
  public left = 0;
  public right = 0;
  public top = 0;
  public bottom = 0;

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
  intersects(rect: Rect): boolean {
    return !(this.right < rect.left || rect.right < this.left || this.bottom < rect.top || rect.bottom < this.top);
  }
}
