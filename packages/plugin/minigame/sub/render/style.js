export const style = {
  container: {
    width: 960,
    height: 1410,
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
    lineHeight: 120,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 6,
    borderColor: '#000000',
  },

  rankList: {
    width: 960,
    // container(1410) - header(120) = 1290，其中 list + listTips(90) + selfListItem(150+50margin) = 1290
    height: 1290,
  },

  list: {
    width: 960,
    height: 960,
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
    marginLeft: 10,
    lineHeight: 150,
    width: 100,
    textAlign: 'right',
  },

  listItemName: {
    fontSize: 36,
    height: 150,
    verticalAlign: 'middle',
    width: 550,
    marginLeft: 30,
  },

  listScoreUnit: {
    opacity: 0.5,
    color: '#000000',
    fontSize: 30,
    height: 150,
    lineHeight: 150,
    marginLeft: 8,
  },

  selfListItem: {
    borderRadius: 20,
    marginTop: 50,
    backgroundColor: '#ffffff',
  },

  listItemNameSelf: {},

  listTips: {
    width: 960,
    height: 90,
    lineHeight: 90,
    textAlign: 'center',
    fontSize: 30,
    color: 'rgba(0,0,0,0.5)',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  }
}
