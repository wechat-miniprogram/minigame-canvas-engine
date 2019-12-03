import style    from 'render/style.js';
import tplFn    from 'render/tplfn.js';
import Layout   from './engine.js'

let selfOpenId = '';
let sharedCanvas  = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');

function draw(data = [], invites) {
    Layout.clear();
    let template = tplFn({
        title: '可能感兴趣好友',
        data,
        invites,
    });

    Layout.init(template, style);
    Layout.layout(sharedContext);
}

/**
 * 如果用户之间存在主动分享邀请记录，会通过jsserver写入key为invite的记录
 * 这里把邀请记录拉下来筛选出我的邀请成功记录
 */
function getInviteData(selfOpenId) {
    return new Promise((resolve, reject) => {
        wx.getFriendCloudStorage({
            keyList: ['invite'],
            success: ({data}) => {
                console.log('getFriendCloudStorage', data);
                data = data.filter( item => item.KVDataList && item.KVDataList.length);
                let result = [];

                let self = data.find(item => item.openid=== selfOpenId);
                let selfData;

                try {
                    selfData = self && self.KVDataList && self.KVDataList[0] && self.KVDataList[0].value && JSON.parse(self.KVDataList[0].value);
                } catch(e) {
                    console.error(e);
                    selfData = null;
                }

                if ( selfData ) {
                    result = data.filter( item => selfData.inviteRecords.find(r => r.openid === item.openid ))
                }

                resolve(result);
            }
        });
    });
}


function showPotentialFriend(invites) {
    wx.getPotentialFriendList({
        success: (data) => {
            let list = data.list || [];

            console.log('getPotentialFriendList', data);

            //list = [{"openid":"o_XwO0Rv7Eim_2jm1SjCqteI1-l8","nickname":"不叫花花白","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epIOjsibRvXISLpoLRjR3YDVsGsCVOFcoYY0Wxk1vY95cyT9XPYbgz6z4lxK7z39ukGsnibTr82KH8g/132","KVDataList":[]},{"openid":"o_XwO0WmN7cLKb9yI4qk_oQyvzSA","nickname":"你大爷还是你大爷","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/krmdRqHOnNBur6vtlfwd75Z89kT1AdLTTYbUgkLFgDrvWatJBGMX5Bjelf5F3jLt0n0Ae5Htiau5ELaOicia81rhg/132","KVDataList":[]},{"openid":"o_XwO0Zu6LnTwoQ1giusKigTfsGs","nickname":"Vvvvvv","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/WkN5QXgM8PoicpLFjvtXSB2jJzzue5ZdEmY4Jicb3d90MLQHdOoJUOFdZWeU5x0uFzhNiamDpOTPqZoUZVKfwOWoA/132","KVDataList":[{"key":"invite","value":"{\"beInvitedRecords\":[{\"fromOpenid\":\"o_XwO0Wq2LtdqTzTRwYowCxzSNos\",\"time\":1575356726233}],\"inviteRecords\":[]}"}]},{"openid":"o_XwO0bxAW01W4zWyb6RtK-E677w","nickname":"ailin","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/S3Xzia2fI4XROoGnkpEeOiaXCUsAZxQ4K1zXRDAGUdjNwqpTIreHDeBtnhv91EeEGjOCzWdZgcibXRISn08KYb2FA/132","KVDataList":[]},{"openid":"o_XwO0Wq2LtdqTzTRwYowCxzSNos","nickname":"袁梓民","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/gUoakOVnV9kCcVOBeJFDThSycWrQ6VqHibzSoUdGBdBLqbbqpxb4gctUm69l6nzTPNhqVVvEQecwt0tr5ibEjD2g/132","KVDataList":[{"key":"invite","value":"{\"beInvitedRecords\":[],\"inviteRecords\":[{\"fromOpenid\":\"o_XwO0Zu6LnTwoQ1giusKigTfsGs\",\"time\":1575356726233}]}"}]}];

            let friends = list.map( (item, i) => {
                return {
                    rank      : i,
                    rankScore : 0,
                    nickname  : item.nickname,
                    avatarUrl : item.avatarUrl,
                    openid    : item.openid,
                }
            });

            draw(friends, invites);

            Layout.getElementsByClassName('listButton').forEach( (item, index) => {
                item.on('click', (e) => {
                    console.log(friends[index]);
                    wx.shareMessageToFriend({
                        openId  : friends[index].openid,
                        title   : '快来探索浩瀚星空',
                        imageUrl: 'https://mmocgame.qpic.cn/wechatgame/TKicR7oWel4znvwMdwOpuwoy1ntVB44kT9ZSse2u0xNcO5SaxIS2UwU0GdUfA2Al0/0'
                    })
                });
            });
        }
    });
}


wx.onMessage(data => {
    console.log(data);

    if ( data.event === 'getOpenId' ) {
        selfOpenId = data.value;

        getInviteData(selfOpenId).then( invites => {
            showPotentialFriend(invites);
        });
    } else if ( data.event === 'refreshData' ) {
        getInviteData(selfOpenId).then( invites => {
            showPotentialFriend(invites);
        });
    } else if ( data.event === 'updateViewPort' ) {
        Layout.updateViewPort(data.box);
    } else if ( data.event === 'close' ) {
        Layout.clearAll();
    } else if ( data.event === 'reciveInvite' ) {
        wx.modifyFriendInteractiveStorage({
            key      :'2',
            opNum    : 1,
            operation: 'add',
            // 静默修改需要用户通过快捷分享消息卡片进入才有效，代表分享反馈操作，无需填写 toUser，直接修改分享者与被分享者交互数据
            quiet    : true,
            complete:(res) => {
                console.log('modifyFriendInteractiveStorage', res);
            }
        })
    }
});

