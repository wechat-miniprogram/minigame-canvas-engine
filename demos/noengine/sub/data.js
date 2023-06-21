function getCurrTime() {
  return parseInt(+new Date() / 1000);
}

function none() {}

/**
 * 获取用户信息
 */
export function getUserInfo(callback = none) {
  wx.getUserInfo({
    openIdList: ["selfOpenId"],
    success: (userRes) => {
      callback(userRes.data[0] || {});
    },
    fail: callback,
  });
}

export function getDataFromSource(item) {
  let source;
  try {
      source = JSON.parse(item.KVDataList[0].value);
  } catch(e) {
      source = {
          "wxgame":{
              "rankScore"      : 0,
              "update_time": getCurrTime()
          }
      }
  }

  /******debug******/
  // source = {
  //   wxgame: {
  //     rankScore: 0,
  //     update_time: getCurrTime(),
  //   },
  // };
  /******debug******/
  return source.wxgame;
}

/**
 * 从后台排行榜列表里面找出自己的信息
 * @param { Array } list
 * @param { Object } selfData: 通过getUserInfo拿到的用户信息
 */

export function findSelf(list, selfData) {
  // console.log("selfData",  selfData);
  let result = {
    index: -1,
    self: null,
  };

  list.forEach((item, index) => {
    if (item.avatarUrl === selfData.avatarUrl) {
      result.self = item;
      let { rankScore, update_time } = getDataFromSource(item);

      result.self.rankScore = rankScore;
      result.self.update_time = update_time;
      result.index = index;
    } else {
      /******debug******/
      result.self = item;
      let { rankScore, update_time } = getDataFromSource(item);

      result.self.rankScore = rankScore;
      result.self.update_time = update_time;
      result.index = index;
      /******debug******/
    }
  });

  return result;
}

/**
 * 用户第一次玩游戏的时候拉取排行榜自身肯定不在列表
 * 如果先setUserCloudStorage -> getFriendCloudStorage串行调用会导致拉取速度很慢
 * 所以如果拉取排行榜之前已经知道用户的分数了，可以getFriendCloudStorage然后手动插入数据
 * 可以大大提高拉取速度
 */
export function injectSelfToList(list, userinfo, rankScore) {
  let item = {
    rank: 1,
    rankScore,
    avatarUrl: userinfo.avatarUrl,
    nickname: userinfo.nickname || userinfo.nickName,
  };

  list.push(item);
}

export function replaceSelfDataInList(list, info, rankScore) {
  list.forEach((item) => {
    if (item.avatarUrl === info.avatarUrl && rankScore > item.rankScore) {
      item.rankScore = rankScore;
    }
  });
}

/**
 * 获取好友排行榜列表
 */
export function getFriendData(key, callback = none) {
  wx.getFriendCloudStorage({
    keyList: [key],
    success: (res) => {
      /*****debug*****/
      res.data = res.data.filter((item) => item.KVDataList.length);
      /*****debug*****/

      let data = res.data.map((item) => {
        let { rankScore, update_time } = getDataFromSource(item);
        item.rankScore = rankScore;
        item.update_time = update_time;

        return item;
      });

      for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
      }

      data.sort((a, b) => b.rankScore - a.rankScore)

      callback(data);
    },
  });
}

/**
 * 拉取用户当前的分数记录，如果当前分数大于历史最高分数，执行上报
 */
export function setUserRecord(key, userData, startTime) {
  let rankScore = userData.rankScore;

  if (rankScore === undefined || rankScore === null) {
    return;
  }

  let time = getCurrTime();
  let record = 0;
  let last_update_time = getCurrTime();

  wx.getUserCloudStorage({
    keyList: [key],
    success: (data) => {
      // 查找个人的最高历史记录
      if (data.KVDataList.length > 0) {
        let { rankScore, update_time } = getDataFromSource(data);
        record = rankScore;
        last_update_time = update_time;
      }

      if (rankScore > record || last_update_time < startTime) {
        wx.setUserCloudStorage({
          KVDataList: [
            {
              key: key,
              value: JSON.stringify({
                wxgame: {
                  rankScore,
                  update_time: time,
                },
              }),
            },
          ],
          success: console.log,
        });
      }
    },
  });
}
