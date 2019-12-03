/*<view class="container" id="main">
  <view class="header">
    <text class="title" value="{{= it.title}}"></text>
  </view>
  <view class="rankList">
        <scrollview class="list">
            {{~it.data :item:index}}
                {{? index % 2 === 1 }}
                <view class="listItem listItemOld">
                {{?}}
                {{? index % 2 === 0 }}
                <view class="listItem">
                {{?}}
                    <text class="listItemNum" value="{{= index + 1}}"></text>
                    <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                  <text class="listItemName" value="{{= item.nickname}}"></text>

                  <view class="listButtonBox">
                  	<text class="listButton" value="邀请">
                  	</text>
                  </view>
                </view>
            {{~}}
        </scrollview>
    </view>
</view>*/


// 上述模板经过模板引擎编译成版本函数，可通过olado.github.io/doT/index.html在线获得
export default function anonymous(it ) { var out='<view class="container" id="main"> <view class="header"> <text class="title" value="'+( it.title)+'"></text> </view> <view class="rankList"> <scrollview class="list"> ';var arr1=it.data;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+=' ';if(index % 2 === 1){out+=' <view class="listItem listItemOld"> ';}out+=' ';if(index % 2 === 0){out+=' <view class="listItem"> ';}out+=' <text class="listItemNum" value="'+( index + 1)+'"></text> <image class="listHeadImg" src="'+( item.avatarUrl )+'"></image> <text class="listItemName" value="'+( item.nickname)+'"></text> <view class="listButtonBox"> <text class="listButton" value="邀请"> </text> </view> </view> ';} } out+=' </scrollview> <view class="inviteList"> <text class="inviteTip" value="成功邀请到下列好友"></text> <view class="inviteUserList"> ';var arr2=it.invites;if(arr2){var item,index=-1,l2=arr2.length-1;while(index<l2){item=arr2[index+=1];out+=' <image class="inviteUserImg" src="'+( item.avatarUrl )+'"></image> ';} } out+=' </view> </view> </view></view>';return out; }


