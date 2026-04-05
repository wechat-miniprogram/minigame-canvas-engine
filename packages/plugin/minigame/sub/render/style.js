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
    textStrokeColor: 'red',
    textStrokeWidth: 1,
  },

  // ── 测试按钮栏（display:none / visibility:hidden 验证用） ────────────────────
  testBtnBar: {
    width: 960,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a2e',
  },

  testBtn: {
    color: '#ffffff',
    borderRadius: 8,
    width: 210,
    height: 60,
    lineHeight: 60,
    fontSize: 24,
    textAlign: 'center',
  },

  testBtnClone: {
    backgroundColor: '#0f3460',
    ':active': { transform: 'scale(1.05, 1.05)' },
  },

  testBtnBatch: {
    backgroundColor: '#533483',
    ':active': { transform: 'scale(1.05, 1.05)' },
  },

  testBtnVisibility: {
    backgroundColor: '#e94560',
    ':active': { transform: 'scale(1.05, 1.05)' },
  },

  testBtnMixed: {
    backgroundColor: '#16813d',
    ':active': { transform: 'scale(1.05, 1.05)' },
  },

  testBtnChildOverride: {
    backgroundColor: '#e67e22',
    ':active': { transform: 'scale(1.05, 1.05)' },
  },

  testStatusBar: {
    width: 960,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },

  testStatusText: {
    color: '#cccccc',
    fontSize: 22,
    width: 600,
    textAlign: 'center',
  },
  // ─────────────────────────────────────────────────────────────────────────────

  rankList: {
    width: 960,
    // container(1410) - header(120) - testBtnBar*2(180) - testStatusBar(50) = 1060 给榜单区域
    height: 1060,
    backgroundImage: 'url(https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM7mL9dDQ8VibStCkTOfNVluNXh3rqZnWAKF27npl0S04l2EFgRutKI7LNxfibiakibE3VA84HNAswmoyg/132)'
  },

  list: {
    width: 960,
    height: 970,
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
    textShadow: '1px 1px 2px blue',
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

  listItemNameSelf: {
    textShadow: '1px 1px 2px blue',
  },

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
