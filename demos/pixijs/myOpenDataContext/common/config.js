export default {
    title    : '排行榜',
    unit     : '分',
    sort     : 'down',
    period   : 'history',
    selfTitle: '本次成绩',

    // 支持的事件枚举
    postTypeMap : {
        init          : -1,
        friendRank    : 2,
        groupRank     : 3,
        report        : 4,
        setTitle      : 5,
        setUnit       : 6,
        setSort       : 7,
        setPeriod     : 8,
        close         : 9,
        updateViewPort: 10,
    },

    // 前三名的颜色配置
    colorMap : {
        1: '#F97E00',
        2: '#FEC11E',
        3: '#F8D114',
    }
}
