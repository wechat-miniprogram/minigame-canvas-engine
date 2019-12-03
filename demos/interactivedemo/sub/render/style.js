export default {
    container: {
        width: 960,
        height: 1480,
        borderRadius: 12,
    },

    header: {
        height: 120,
        width: 960,
        flexDirection: 'column',
        alignItems: 'center',
      	backgroundColor: '#ffffff',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.3)',
    },

    title: {
        width: 144,
        fontSize: 48,
        height: 120,
        lineHeight: 120,
        textAlign: 'center',
        fontWeight: 'bold',
        borderBottomWidth: 6,
        borderColor: '#000000',
    },

    rankList: {
        width: 960,
        height: 1070,
      	backgroundColor: '#ffffff',
    },

    list: {
        width          : 960,
        height         : 750,
      	backgroundColor: '#ffffff',
        marginTop: 30,
    },

    listItem: {
        backgroundColor: '#F7F7F7',
        width: 960,
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
    },

    listItemOld: {
       backgroundColor: '#ffffff',
    },

    listItemNum: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#452E27',
        lineHeight: 150,
        height: 150,
        textAlign: 'center',
        width: 120,
    },

    listHeadImg: {
        borderRadius: 6,
        width: 90,
        height: 90,
    },

    listItemScore: {
        fontSize: 48,
        fontWeight: 'bold',
        marginLeft : 10,
        height: 150,
        lineHeight: 150,
        width: 300,
        textAlign: 'right',
    },

    listItemName:{
        fontSize: 36,
        height: 150,
        lineHeight: 150,
        width: 500,
        marginLeft: 30,
    },

  	listButtonBox: {
      	width: 150,
      	height: 150,
      	flexDirection: 'row',
        alignItems: 'center',
    },
   	listButton: {
      	fontSize: 40,
      	height: 80,
      	width: 150,
      	lineHeight: 80,
      	textAlign: 'center',
      	borderWidth: 2,
      	color: '#28a745',

      	borderColor: '#28a745',
    },

  	inviteTip: {
      	width: 960,
        height: 90,
      	lineHeight: 90,
      	textAlign: 'center',
      	fontSize: 35,
      	color: 'rgba(0,0,0,0.5)',
      	backgroundColor: '#ffffff',
        borderRadius: 10,
    },
  	inviteUserList: {
      	width: 960,
        height: 150,
      	flexDirection: 'row',
    },
	inviteUserImg: {
        borderRadius: 55,
        width: 110,
        height: 110,
      	marginLeft: 50,
    }
}

