let doT = require('../open-data-context-engine/libs/dot.js');

const template = `
    <view class="container" id="main">
        <view class="rankList">
            <view class="header">
                <text class="headerItem headerItemCurr" value="{{= it.title }}"></text>
            </view>

            <scrollview class="list">
                {{~it.data :item:index}}
                    {{? index % 2 === 1 }}
                        <view class="listItem listItemBgWhite">
                    {{?}}
                    {{? index % 2 === 0 }}
                        <view class="listItem">
                    {{?}}

                        <text class="listItemNum" value="{{= index + 1}}"></text>
                        <image class="listImg" src="{{= item.avatarUrl }}"></image>
                        <text class="listName" value="{{= item.nickname }}"></text>

                        <view class="listScore">
                            <image class="listStarImg" src="/myOpenDataContext/img/Buffet_icon_GiftPlate.png"></image>
                        </view>
                    </view>
                {{~}}
            </scrollview>

            <view class="rankBottom">
                <text class="rankTip" value="{{= it.rankTip}}"></text>
            </view>
        </view>

        <view class="selfRank">
            <view class="listItem selfListItem">
                <text class="listItemNum" value="{{= it.self.rank}}"></text>
                <image class="listImg" src="{{= it.self.avatarUrl }}"></image>
                <text class="listName" value="{{= it.self.nickname }}"></text>

                <view class="listScore">
                    <text class="listScoreValue" value="{{= it.self.score }}"></text>
                    <text class="listScoreUnit" value="{{= it.unit || ''}}"></text>
                </view>
            </view>
        </view>
    </view>
`;

console.log(doT.template(template));
let tplFn = doT.template(template);

console.log(tplFn)

