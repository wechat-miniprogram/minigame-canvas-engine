
import './template.js';

export default function(it) {
	var out=' <view class="container" id="main"> <view class="rankList"> <view class="header"> <text class="headerItem headerItemCurr" value="'+( it.title )+'"></text> </view> <scrollview class="list"> ';var arr1=it.data;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+=' <view class="listItem"> <text class="listItemNum" value="'+( index + 1)+'"></text> <image class="listHeadImg" src="'+( item.avatarUrl )+'"></image> <view class="infoContainer"> <view class="nameContainer">                                 <text class="listName" value="'+( item.nickname)+'"></text> </view> <view class="scoreContainer"> <image class="listStarImg" src="sub/UI_Icon_Rating.png"></image> <text class="listName" value ="'+(item.starSum || 1)+'"></text> </view> </view> <image class="giftBtn" src="sub/Buffet_icon_GiftPlate.png"></image> </view> ';} } out+=' </scrollview> </view> </view>';return out;
}
