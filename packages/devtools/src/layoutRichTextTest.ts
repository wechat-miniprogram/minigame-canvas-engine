
// const parser = require('./htmlparser/html2json')

import { template } from 'dot';


function main() {
  // let template = `
  //   <p>亲爱的神位者大人：</p>\n\n<p>    欢迎参加《空之旅人》命运测试，本次测试为安卓计费删档测试，测试时间为2021年1月26日~2021年2月2日，测试期间游戏内将开启充值功能。在本次命运测试期间，神位者大人在游戏内的充值总金额，将在游戏正式上线后按照「充值返还规则」进行返还。</p>\n\n<p> </p>\n\n<p><strong>充值返还规则明细：</strong></p>\n\n<p>    本次测试期间，您在游戏内充值的总金额（<span style=\"color:#ff0000\">含礼包、周卡</span>）将按照1元=10星晶石的标准在游戏正式上线时返还<span style=\"color:#ff0000\">200%</span>倍率的星晶石。（计算后若有小数则作进1处理）</p>\n\n<p>例1：本次测试期间您充值购买了30元档位星晶石，在公测时您可以获得30*10*200%=600星晶石</p>\n\n<p>例2：本次测试期间您充值购买了30元档位星晶石及6元礼包，在公测时您可以获得（30+6）*10*200%=720星晶石</p>\n\n<p>例3：本次测试期间您充值购买了30元档位星晶石及18元周卡，在公测时您可以获得（30+18）*10*200%=960星晶石</p>\n\n<p> </p>\n\n<p><strong>充值返还领取方式：</strong></p>\n\n<p>     游戏正式上线后，在本次命运测试期间参与付费的神位者大人，选择与本次测试相同的下载渠道，并使用与本次测试相同的账号创建角色，该账号创建的<span style=\"color:#ff0000\">第一个</span>角色在进入游戏后可领取充值返还奖励。</p>\n\n<p> </p>\n\n<p><strong>注意事项：</strong></p>\n\n<p>1.本次付费测试的充值返还规则<span style=\"color:#ff0000\">只适用于安卓官方服及安卓渠道服，不包含iOS服</span>，给您带来的不便恳请谅解。</p>\n\n<p>2.本次付费测试的充值返还奖励<span style=\"color:#ff0000\">不支持跨渠道领取</span>，游戏正式上线时您仅可在对应渠道领取充值返还奖励，如本次测试神位者大人在安卓官方服进行充值，在游戏正式上线时，充值返还奖励也只能在安卓官方服领取。</p>\n\n<p>3.本次付费测试的充值返还奖励只能返还到<span style=\"color:#ff0000\">与本次测试相同的充值账号下</span>，不支持跨账号返还，请大家牢记参与本次测试的账号信息。</p>\n\n<p>4.本次付费测试的充值返还奖励<span style=\"color:#ff0000\">无法返还到游客账号中</span>，请使用游客账号的神位者大人及时绑定账号，以防受到不必要的损失。</p>\n\n<p>5.本次付费测试的充值返还奖励需要在<span style=\"color:#ff0000\">游戏正式上线后180天内创建角色领取</span>，请神位者大人注意领取时间，以免错过奖励。</p>\n\n<p style=\"text-align:center\"> </p>\n\n<p> <strong>  *以上内容的最终解释权归《空之旅人》运营团队所有。</strong></p>\n\n<p> </p>
  //   `

  let tpl = `
    <view class="container" id="main">
      <view class="body_container">
          <image src="https://res-cdn-sdk.longtugame.cn/notice/20000034-01/notice/bg_20230508110855.png" class="bg_img"></image>
          <scrollview class="left_container" scrollY="true">
              {{~it.items :item:index}}
              <text font="fnt_number-export" class="title" value="{{= item.title}}"></text>
              {{~}}
          </scrollview>
          <scrollview class="right_container" scrollY="true" >
            <richtext id="rich"></richtext>
          </scrollview>
      </view>
    </view>
  `

  // console.log(JSON.stringify(parser.html2json(template)))

  let style = {
    container: {
      width: 1410,
      height: 960,
      borderRadius: 12,
    },
    bg_img: {
      width: 1410,
      height: 960,
      position: 'absolute',
      top: 0,
      left: 0,
    },
    body_container: {
      width: 1410,
      height: 960,
      paddingTop: 100,
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      // backgroundImage: 'http://res-cdn-sdk.longtugame.cn/notice/20000034-01/notice/bg_20230508110855.png'
    },
    left_container: {
      width: 400,
      height: 400,
      backgroundColor: 'transparent',
      opacity: 0
    },
    title: {
      width: 400,
      fontSize: 48,
      height: 120,
      textAlign: 'center',
      lineHeight: 120,
      fontWeight: 'bold',
      borderBottomWidth: 6,
      borderColor: '#000'
    },
    right_container: {
      backgroundColor: 'transparent',
      width: 1000,
      height: 800
    },
    content: {
      width: 400,
      fontSize: 48,
      height: 120,
      lineHeight: 120,
      textAlign: 'left',
      fontWeight: 'bold',
      borderBottomWidth: 6,
      borderColor: '#000000',
      verticalAlign: 'middle'
    },

    rich: {
      width: 900,
      borderWidth: 2,
      height: 2000,
      fontSize: 30,
      lineHeight: 36,
      // backgroundColor: 'red'
    }
  }

  const datasource = {
    items: [{
      title: '公告1',
      content: '公告内容1'
    }, {
      title: '公告2',
      content: '公告内容2'
    }, {
      title: '公告3',
      content: '公告内容3'
    }]
  };

  const Layout = window.Layout;
  Layout.init(template(tpl)(datasource), style);

  // 首先在HTML里面创建canvas
  // <canvas id="canvas"></canvas>

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  document.body.append(canvas)

  // 设置canvas的尺寸和样式的container比例一致
  canvas.style.width = 1410 / 2 + 'px';
  canvas.style.height = 960 / 2 + 'px';
  canvas.width = 1410;
  canvas.height = 960;

  Layout.updateViewPort(canvas.getBoundingClientRect());

  Layout.layout(context);

  const rich = Layout.getElementsById('rich')[0]

  console.log(rich)

  // rich.text = '<p>亲爱的神位者大人：</p>\n\n<p>    欢迎参加《空之旅人》命运测试，本次测试为安卓计费删档测试，测试时间为2021年1月26日~2021年2月2日，测试期间游戏内将开启充值功能。在本次命运测试期间，神位者大人在游戏内的充值总金额，将在游戏正式上线后按照「充值返还规则」进行返还。</p>\n\n<p> </p>\n\n<p><strong>充值返还规则明细：</strong></p>\n\n<p>    本次测试期间，您在游戏内充值的总金额（<span style=\"color:#ff0000\">含礼包、周卡</span>）将按照1元=10星晶石的标准在游戏正式上线时返还<span style=\"color:#ff0000\">200%</span>倍率的星晶石。（计算后若有小数则作进1处理）</p>\n\n<p>例1：本次测试期间您充值购买了30元档位星晶石，在公测时您可以获得30*10*200%=600星晶石</p>\n\n<p>例2：本次测试期间您充值购买了30元档位星晶石及6元礼包，在公测时您可以获得（30+6）*10*200%=720星晶石</p>\n\n<p>例3：本次测试期间您充值购买了30元档位星晶石及18元周卡，在公测时您可以获得（30+18）*10*200%=960星晶石</p>\n\n<p> </p>\n\n<p><strong>充值返还领取方式：</strong></p>\n\n<p>     游戏正式上线后，在本次命运测试期间参与付费的神位者大人，选择与本次测试相同的下载渠道，并使用与本次测试相同的账号创建角色，该账号创建的<span style=\"color:#ff0000\">第一个</span>角色在进入游戏后可领取充值返还奖励。</p>\n\n<p> </p>\n\n<p><strong>注意事项：</strong></p>\n\n<p>1.本次付费测试的充值返还规则<span style=\"color:#ff0000\">只适用于安卓官方服及安卓渠道服，不包含iOS服</span>，给您带来的不便恳请谅解。</p>\n\n<p>2.本次付费测试的充值返还奖励<span style=\"color:#ff0000\">不支持跨渠道领取</span>，游戏正式上线时您仅可在对应渠道领取充值返还奖励，如本次测试神位者大人在安卓官方服进行充值，在游戏正式上线时，充值返还奖励也只能在安卓官方服领取。</p>\n\n<p>3.本次付费测试的充值返还奖励只能返还到<span style=\"color:#ff0000\">与本次测试相同的充值账号下</span>，不支持跨账号返还，请大家牢记参与本次测试的账号信息。</p>\n\n<p>4.本次付费测试的充值返还奖励<span style=\"color:#ff0000\">无法返还到游客账号中</span>，请使用游客账号的神位者大人及时绑定账号，以防受到不必要的损失。</p>\n\n<p>5.本次付费测试的充值返还奖励需要在<span style=\"color:#ff0000\">游戏正式上线后180天内创建角色领取</span>，请神位者大人注意领取时间，以免错过奖励。</p>\n\n<p style=\"text-align:center\"> </p>\n\n<p> <strong>  *以上内容的最终解释权归《空之旅人》运营团队所有。</strong></p>\n\n<p> </p>'
  rich.text = `
  <p>亲爱的神位者大人：</p>

<p>    欢迎参加《空之旅人》命运测试，本次测试为安卓计费删档测试，测试时间为2021年1月26日~2021年2月2日，测试期间游戏内将开启充值功能。在本次命运测试期间，神位者大人在游戏内的充值总金额，将在游戏正式上线后按照「充值返还规则」进行返还。</p>

<p> </p>

<p><strong>充值返还规则明细：</strong></p>

<p>    本次测试期间，您在游戏内充值的总金额（<span style="color:#ff0000">含礼包、周卡</span>）将按照1元=10星晶石的标准在游戏正式上线时返还<span style="color:#ff0000">200%</span>倍率的星晶石。（计算后若有小数则作进1处理）</p>

<p>例1：本次测试期间您充值购买了30元档位星晶石，在公测时您可以获得30*10*200%=600星晶石</p>

<p>例2：本次测试期间您充值购买了30元档位星晶石及6元礼包，在公测时您可以获得（30+6）*10*200%=720星晶石</p>

<p>例3：本次测试期间您充值购买了30元档位星晶石及18元周卡，在公测时您可以获得（30+18）*10*200%=960星晶石</p>

<p> </p>

<p><strong>充值返还领取方式：</strong></p>

<p>     游戏正式上线后，在本次命运测试期间参与付费的神位者大人，选择与本次测试相同的下载渠道，并使用与本次测试相同的账号创建角色，该账号创建的<span style="color:#ff0000">第一个</span>角色在进入游戏后可领取充值返还奖励。</p>

<p> </p>

<p><strong>注意事项：</strong></p>

<p>1.本次付费测试的充值返还规则<span style="color:#ff0000">只适用于安卓官方服及安卓渠道服，不包含iOS服</span>，给您带来的不便恳请谅解。</p>

<p>2.本次付费测试的充值返还奖励<span style="color:#ff0000">不支持跨渠道领取</span>，游戏正式上线时您仅可在对应渠道领取充值返还奖励，如本次测试神位者大人在安卓官方服进行充值，在游戏正式上线时，充值返还奖励也只能在安卓官方服领取。</p>

<p>3.本次付费测试的充值返还奖励只能返还到<span style="color:#ff0000">与本次测试相同的充值账号下</span>，不支持跨账号返还，请大家牢记参与本次测试的账号信息。</p>

<p>4.本次付费测试的充值返还奖励<span style="color:#ff0000">无法返还到游客账号中</span>，请使用游客账号的神位者大人及时绑定账号，以防受到不必要的损失。</p>

<p>5.本次付费测试的充值返还奖励需要在<span style="color:#ff0000">游戏正式上线后180天内创建角色领取</span>，请神位者大人注意领取时间，以免错过奖励。</p>

<p style="text-align:center"> </p>

<p> <strong>  *以上内容的最终解释权归《空之旅人》运营团队所有。</strong></p>

<p> </p>`

}

main();
