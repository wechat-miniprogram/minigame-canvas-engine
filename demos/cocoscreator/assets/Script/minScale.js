cc.Class({
    extends: cc.Component,

    properties: {
        // holdDlgSize : false,
        actionFlag : false,
    },

    fixSize() {
        let sx = cc.winSize.width / 1242;
        let sy = cc.winSize.height / 2688;
        let minScale = Math.min(sx, sy);

        this.node.scale = minScale;
    },

    start () {
        // this.cbId = global.addResizeCallback(this, this.fixSize);
    },

    onDestroy() {
        // global.removeResizeCallback(this.cbId); 
    },

    onEnable () {
        this.fixSize();

        if (!this.actionFlag) {
            return;
        }

        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            event  : 'updateViewPort',
            box    : this.node.getBoundingBoxToWorld(),
            winSize: cc.winSize,
        });
    },
});
