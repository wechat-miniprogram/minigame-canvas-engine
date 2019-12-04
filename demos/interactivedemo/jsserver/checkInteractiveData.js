exports.main = function(arg) {
    try {
        arg = JSON.parse(arg);
        const myOpenid         = wx.getOpenId();
        const toOpenid         = arg.toUser;
        const opNum            = arg.opNum;
        const now              = new Date();
        const inviteStorageKey = 'invite';
        const friendsStorage   = wx.getFriendUserStorage([inviteStorageKey]);

        // 过滤和邀请不相关的用户
        const userList         = friendsStorage.user_item.filter( item => item.kv_list && item.kv_list.length);
        let ok                 = false;

        // 用户每天只能给同一个好友赠送一次金币,每天最多送5次
        const friendData = userList.find(userItem => userItem.openid === toOpenid) || { kv_list: []};
        const myData     = userList.find(userItem => userItem.openid === myOpenid) || { kv_list: []};

        const friendKV = friendData.kv_list[friendData.kv_list.length - 1];
        const selfKV   = myData.kv_list[myData.kv_list.length - 1];

        let friendGift = friendKV && friendKV.value
        let selfGift   = selfKV && selfKV.value;

        // 好友的记录
        if (friendGift) {
            friendGift = JSON.parse(friendGift)
        } else {
            friendGift = {
                // 被邀请记录
                beInvitedRecords: [],
                // 邀请成功记录
                inviteRecords   : [],
            }
        }

        // 我的记录
        if (selfGift) {
            selfGift = JSON.parse(selfGift)
        } else {
            selfGift = {
                // 被邀请记录
                beInvitedRecords: [],
                // 邀请成功记录
                inviteRecords   : [],
            }
        }

        // 判断是否已经邀请成功过
        const hasInvite = friendGift.inviteRecords.find(item => item.openid === myOpenid );
        if ( hasInvite ) {
            ok = false;
            // 验证通过
            return JSON.stringify({
                "ret": false
            });
        } else {
            friendGift.inviteRecords.push({
                openid: myOpenid,
                time  : Date.now()
            });

            selfGift.beInvitedRecords.push({
                openid: toOpenid,
                time      : Date.now()
            });

            // 写对方的数据
            let ret1 = wx.setFriendUserStorage(toOpenid, [{
                key  : inviteStorageKey,
                value: JSON.stringify(friendGift)
            }]);

            // 写自己的数据
            let ret2 = wx.setFriendUserStorage(myOpenid, [{
                key: inviteStorageKey,
                value: JSON.stringify(selfGift)
            }]);

            if (ret1.errcode == 0 && ret2.errcode == 0) {
                ok = true
            } else {
                console.error('fail');
            }

            if (ok) {
                // 验证通过
                return JSON.stringify({
                    "ret": true
                });
            } else {
                // 验证不通过
                return JSON.stringify({
                    "ret": false
                });
            }
        }

    } catch(err) {
        console.error(err.message);
    }
}

