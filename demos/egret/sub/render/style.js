
let sys = wx.getSystemInfoSync();
let dpr = sys.pixelRatio;

export default {
    container: {
        width: sys.screenWidth * dpr,
        height: sys.screenHeight * dpr,
        justifyContent: 'center',
        alignItems: 'center'
    },

    rankList: {
        width: 1100,
        height: 1276,
        backgroundColor: '#FCF5EA',
    },

    selfRank: {
        width: 1100,
        height: 194,
        // marginTop: 20,
    },

    header: {
        width: 1100,
        height: 150,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: 'rgb(233, 233, 233)',
        justifyContent: 'center'
    },

    headerItem: {
        fontSize: 50,
        color: 'rgba(0, 0, 0, 0.3)',
        lineHeight: 150,
        // flex: 1,
        textAlign: 'center',
        maxWidth: 100,
        width: 200,
        height: 150,
    },

    headerItemCurr: {
        color: '#000000',
        borderBottomWidth: 5,
        borderColor: '#000000',
        fontSize: 50,
        fontWeight: 'bold',
    },

    headerBorder:{
        height: 2,
        width: 640,
        backgroundColor: 'rgb(233, 233, 233)',
    },

    list: {
        width: 1100,
        height: 1126,
    },

    listItem: {
        borderRadius : 30,
        backgroundColor: '#F4DA96',
        marginTop : 20,
        width: 1100,
        height: 194,
        flexDirection: 'row',
        alignItems: 'center',
    },

    listItemBgWhite: {
        backgroundColor: '#ffffff',
    },

    listItemNum: {
        fontSize: 40,
        color: '#452E27',
        // backgroundColor: '#00ff00',
        lineHeight: 90,
        height: 90,
        textAlign: 'center',
        width: 120,
    },

    listHeadImg: {
        borderRadius: 4,
        width: 100,
        height: 100,
    },

    infoContainer:{
        // marginLeft : 20,
    },

    scoreContainer : {
        // backgroundColor : "#0000ff",
        flexDirection: 'row',
        marginLeft: 30
    },

    listStarImg: {
        width: 50,
        height: 50,
    },

    nameContainer:{
        // backgroundColor : "#ff0000",
        width: 230,
        height: 50,
        marginLeft: 30,
    },

    listName: {
        fontSize: 40,
        color: '#452E27',
        height: 50,
        lineHeight: 50,
        width: 230,
    },

    listScore: {
        flexDirection: 'row',
    },

    listScoreValue: {
        fontSize: 32,
        width: 200,
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        color: '#452E27',
        fontWeight: 'bold',
    },

    listScoreUnit: {
        opacity: 0.5,
        color: '#000000',
        fontSize: 20,
        height: 100,
        lineHeight: 100,
        marginLeft: 8,
    },

    giftBtnContainer: {
        position : 'absolute',
        top : 40,
        right: 40,
        width : 120,
        height : 120,
    },
    
    giftBtn: {
        width : 120,
        height : 120,
        marginLeft: 400
    },

    selfListItem: {
        borderRadius: 10,
        backgroundColor: '#ffffff',
    }
}
