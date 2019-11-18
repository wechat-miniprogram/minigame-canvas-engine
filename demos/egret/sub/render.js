import {
    getFirstDayOfSomeMonthsBefore,
    getMonday,
    getSomeDaysBefore,
} from 'common/time.js';

import config   from 'common/config.js';
import style    from 'render/style.js';
import tplFn    from 'render/tplfn.js';


// import Layout   from 'open-data-context-engine/index.js';

import Layout from './engine.js'

function createCanvas(width, height) {
    let can    = wx.createCanvas();
    let ctx    = can.getContext('2d');
    can.width  = width;
    can.height = height;

    return {
        can,
        ctx,
    }
}

let userImgList = [];

let sys = wx.getSystemInfoSync();
let dpr = sys.pixelRatio;
const WIDTH = sys.screenWidth * dpr;
const HEIGHT = sys.screenHeight * dpr;

class Render {
    constructor() {
        this.title      = config.title;
        this.unit       = config.unit;
        this.sort       = config.sort;
        this.period     = config.period;
        this.selfTitle  = config.selfTitle;

        this.currScore  = 0,
        this.startTime  = getSomeDaysBefore(999).s;

        this.sharedCanvas  = wx.getSharedCanvas();
        this.sharedContext = this.sharedCanvas.getContext('2d');
    }

    dataFilter(data) {
        // 默认展示历史分数，这里考虑指定了周期的情况
        if ( this.period !== 'history' ) {
            data = data.filter(item => {
                return item.update_time >= this.startTime;
            });
        }

        // 默认降序，如果指定了升序，反过来
        if ( this.sort == 'up' ) {
            data.sort((a, b) => {
                return a.score - b.score;
            });
        }

        // 修正所有的排名数据
        data.forEach( (one, index) => one.rank = index + 1);
    }

    draw(data = [], selfData, currScore) {
         // 数据排序和筛选逻辑
        this.dataFilter(data);

        this.selfData  = selfData;
        this.currScore = currScore;

        let template = tplFn({
            data,
            self   : selfData || data[0],
            title  : this.title,
            rankTip: '仅展示前50位好友',
            unit   : this.unit,
            btnSrc : 'sub/UI_Icon_Rating.png'
        });

        Layout.updateViewPort({
            width : sys.screenWidth,
            height: sys.screenHeight,
            x     : 0,
            y     : 0,
        });


        Layout.init(template, style);
        Layout.layout(this.sharedContext);
        
        console.log(Layout)
    }

    setTitle(value) {
        this.title = String(value);
    }

    setUnit(value) {
        this.unit = String(value);
    }

    setSelfTitle(value) {
        this.selfTitle = String(value);
    }

    setSort(value) {
        this.sort = value;
    }

    setPeriod(value) {
        this.period = value;
        let startTime;
        switch (this.period) {
            case 'week':
                startTime = getMonday().s;
                break;
            case 'month':
                startTime = getFirstDayOfSomeMonthsBefore(0).s;
                break;
            case 'day':
                startTime = getSomeDaysBefore(0).s;
                break;
            default:
                startTime = getSomeDaysBefore(9999).s;
        }

        this.startTime = startTime;
    }

    disable() {
    }

    updateViewPort(data) {
        let { box, winSize } = data;

         /**
         * 设置子域绘制的真实物理尺寸
         * 子域不理解主域用的引擎，又需要独立进行事件处理，需要将真实的物理尺寸传给渲染引擎
         */
        let offsetX = sys.screenWidth * (box.x / winSize.width);
        let offsetY = sys.screenHeight * (box.y / winSize.height);

        const renderW = sys.screenWidth * (box.width / winSize.width);
        const renderH = sys.screenHeight * (box.height / winSize.height);

        console.log('oneMessageData', data)
        console.log('viewPort', offsetX, offsetY, renderW, renderH);

        Layout.updateViewPort({
            width : renderW,
            height: renderH,
            x     : offsetX,
            y     : offsetY,
        });
    }
}

export default new Render();
