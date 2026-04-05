
/**
 * 由 template.js 通过 doT.js 编译生成，请勿手动修改此文件
 * 如需修改模板，请编辑 template.js 后重新运行编译：
 *   node -e "
 *     const doT = require('dot');
 *     doT.templateSettings.strip = false;
 *     // ... (见 template.js 顶部注释)
 *   "
 * 参考：https://github.com/olado/doT
 */
export function tplFn(it) {
var out='\n<view class="container" id="main">\n  <view class="header">\n    <text class="title" value="排行榜"></text>\n  </view>\n  <view id="testBtnBar" class="testBtnBar">\n    <text id="cloneInsertBtn" class="testBtn testBtnClone" value="克隆并插入"></text>\n    <text id="batchHideBtn"   class="testBtn testBtnBatch" value="批量none"></text>\n    <text id="batchVisibilityBtn" class="testBtn testBtnVisibility" value="批量hidden"></text>\n  </view>\n  <view id="testBtnBar2" class="testBtnBar">\n    <text id="mixedHideBtn" class="testBtn testBtnMixed" value="混合隐藏"></text>\n    <text id="childOverrideBtn" class="testBtn testBtnChildOverride" value="子覆盖父hidden"></text>\n  </view>\n  <view id="testStatusBar" class="testStatusBar">\n    <text id="testStatusText" class="testStatusText" value="点击条目随机none/hidden"></text>\n  </view>\n  <view class="rankList">\n        <scrollview class="list" scrollY="true">\n            ';var arr1=it.data;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+='\n                ';if(index % 2 === 1){out+='\n                <view id="listItem_'+(index)+'" class="listItem listItemOld">\n                ';}out+='\n                ';if(index % 2 === 0){out+='\n                <view id="listItem_'+(index)+'" class="listItem">\n                ';}out+='\n                    <text class="listItemNum" value="'+(index + 1)+'"></text>\n                    <image class="listHeadImg" src="'+(item.avatarUrl)+'"></image>\n                  <text class="listItemName" value="'+(item.nickname)+'"></text>\n                  <text class="listItemScore" value="'+(item.rankScore)+'"></text>\n                  <text class="listScoreUnit" value="分"></text>\n                </view>\n            ';} } out+='\n        </scrollview>\n        <text class="listTips" value="仅展示前50位好友排名"></text>\n\n        <view class="listItem selfListItem">\n            <text class="listItemNum" value="'+(it.selfIndex)+'"></text>\n            <image class="listHeadImg" src="'+(it.self.avatarUrl)+'"></image>\n            <text class="listItemName listItemNameSelf" value="'+(it.self.nickname)+'"></text>\n            <text class="listItemScore" value="'+(item.rankScore)+'"></text>\n            <text class="listScoreUnit" value="分"></text>\n        </view>\n    </view>\n</view>\n';return out;
}
