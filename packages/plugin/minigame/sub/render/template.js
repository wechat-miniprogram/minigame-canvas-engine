const template = `
<view class="container" id="main">
  <view class="header">
    <text class="title" value="排行榜"></text>
  </view>
  <view id="testBtnBar" class="testBtnBar">
    <text id="cloneInsertBtn" class="testBtn testBtnClone" value="克隆并插入"></text>
    <text id="batchHideBtn"   class="testBtn testBtnBatch" value="批量隐藏恢复"></text>
    <text id="testStatusText" class="testStatusText" value="点击榜单条目可隐藏5秒"></text>
  </view>
  <view class="rankList">
        <scrollview class="list" scrollY="true">
            {{~it.data :item:index}}
                {{? index % 2 === 1 }}
                <view id="listItem_{{= index}}" class="listItem listItemOld">
                {{?}}
                {{? index % 2 === 0 }}
                <view id="listItem_{{= index}}" class="listItem">
                {{?}}
                    <text class="listItemNum" value="{{= index + 1}}"></text>
                    <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                  <text class="listItemName" value="{{= item.nickname}}"></text>
                  <text class="listItemScore" value="{{= item.rankScore}}"></text>
                  <text class="listScoreUnit" value="分"></text>
                </view>
            {{~}}
        </scrollview>
        <text class="listTips" value="仅展示前50位好友排名"></text>

        <view class="listItem selfListItem">
            <text class="listItemNum" value="{{= it.selfIndex}}"></text>
            <image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
            <text class="listItemName listItemNameSelf" value="{{= it.self.nickname}}"></text>
            <text class="listItemScore" value="{{= item.rankScore}}"></text>
            <text class="listScoreUnit" value="分"></text>
        </view>
    </view>
</view>
`;
