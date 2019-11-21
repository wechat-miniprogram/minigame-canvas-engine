cc.Class({
    extends: cc.Component,

    properties: {
        // holdDlgSize : false,
        actionFlag : true,
    },

    fixSize() {
        let sx = cc.winSize.width / 1242;
        let sy = cc.winSize.height / 2688;
        let minScale = Math.min(sx, sy);

        this.node.scale = minScale;
    },

    start () {
        
    },

    onDestroy() {
    
    },

    onEnable () {
        cc.director.setClearColor(cc.color(245, 245, 245, 1)); 
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
