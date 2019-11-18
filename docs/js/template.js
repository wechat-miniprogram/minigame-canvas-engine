export default
`<view class="container" id="main">
    <view class="rankList">
        <scrollview class="list">
            {{~it.data :item:index}}
                <view class="listItem">
                    <text class="listItemNum" value="{{= index + 1}}"></text>
                    <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                    <view class="infoContainer">
                        <view class="nameContainer">
                            <text class="itemListName" value="{{= item.nickname}}"></text>
                        </view>
                        <view class="scoreContainer">
                            <image class="listStarImg" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191111/UI_Icon_Rating.png"></image>
                            <text class="listScore" value ="{{=item.starSum}}"></text>
                        </view>
                    </view>
                    <view class="giftBtnContainer">
                        <image class = "giftBtn" id="img{{=index}}" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191111/Buffet_icon_GiftPlate.png"></image>
                    </view>
                </view>
            {{~}}
        </scrollview>
        <view class="selfRank">
            <text class="listItemNum" value="{{= it.selfIndex || 1}}"></text>
            <image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
            <text class="selfListName" value="{{= it.self.nickname}}"></text>
            <image class="selfListStarImg" src="https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191111/UI_Icon_Rating.png"></image>
            <text class="listScore" value ="{{= it.self.starSum}}"></text>
        </view>
    </view>
</view>
`
