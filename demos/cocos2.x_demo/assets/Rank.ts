const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  start() {

    /**
     * 开放数据域用 Layout 来实现，必须告诉 Layout 开放数据域最终被绘制到屏幕上的包围盒
     * 比如 iPhone 12 Pro Max 的物理尺寸是 414 * 896，如果开放数据域的尺寸是 200 * 200，绘制在屏幕正中央
     * 那么最终包围盒是{ x: 107, y: 348, width: 200, height: 200 }
     * 但在 Cococs 中是跟 Cocos 的坐标系打交道，因此要将 Cocos 的坐标系换算成木屏幕坐标系，坐标原点为左上角
     * 下面是参考转换逻辑
     */

    // 返回节点在世界坐标系下的对齐轴向的包围盒（AABB），这个包围盒是相对于设计尺寸的
    const box = this.node.getBoundingBoxToWorld();

    // Cocos 的屏幕适配规则，详情可见：https://docs.cocos.com/creator/2.4/manual/zh/ui/multi-resolution.html?h=%E9%80%82%E9%85%8D
    const scaleX = cc.view.getScaleX();
    const scaleY = cc.view.getScaleY();
    const devicePixelRatio = cc.view.getDevicePixelRatio();

    // 设计尺寸
    const designSize = cc.view.getDesignResolutionSize();
    // canvas 画布的尺寸
    const vireportRect = cc.view.getViewportRect();

    // Cocos 实际的场景在 Canvas 画布中的偏移，比如按照 fixWidth 的适配规则而屏幕有比较长的话，最终渲染出来屏幕上下是有黑边的，这里计算的就是黑边的大小
    const offsetY = (vireportRect.height - (designSize.height * scaleY)) / 2;
    const offsetX = (vireportRect.width - (designSize.width * scaleX)) / 2;

    // 将计算出来的相对屏幕的包围盒信息发送给开放数据域，开放数据域根据这个事件来初始化
    window.__globalAdapter && window.__globalAdapter.getOpenDataContext().postMessage({
      event: 'layoutUpdateViewPort',
      x: ((box.x * scaleX) + offsetX) / devicePixelRatio,
      y: (box.y * scaleY + offsetY) / devicePixelRatio,
      width: box.width * scaleX / devicePixelRatio,
      height: box.height * scaleY / devicePixelRatio,
    })
  }
}