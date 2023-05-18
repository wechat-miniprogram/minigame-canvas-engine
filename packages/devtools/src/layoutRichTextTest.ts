
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
//   rich.text = `<p>亲爱的神位者大人：</p>

// rich.text = `<p>亲爱的神位者大人：</p>\n\n<p><br />\n     历时八天，《空之旅人》「命运测试」划上了句号，服务器也已于2月2日23:59正式关闭。本次测试期间，我们收到了神位者大人们的鼓励和支持，也认真听取了许多批评、建议的声音，比如：<br />\n1.神位者大人吐槽最多的魂使3D建模问题，我们会对魂使建模进行全面优化，增强模型精度、优化渲染效果、提升3D模型的整体表现；<br />\n2.给神位者大人带来很大困扰魂使技能问题，我们后续会对魂使技能描述及实际技能效果进行全面排查，确保描述与版本内保持一致；<br />\n3.魂使平衡性的问题，我们会从魂使技能机制、魂使属性值、流派特性等方面入手，优化整体的平衡性，尽量避免出现过强或过弱的体系；<br />\n4.抽卡体验问题，目前的抽卡机制对于部分神位者大人不是非常友好，我们后续会对相关规则进行评估优化；<br />\n5.游戏黑屏、乱码弹窗等问题，我们会在性能优化上继续下功夫，减少此类问题的出现。<br />\n <br />\n      项目组会认真接受批评，思考优化方案，将这些问题解决掉，在下次相见时给您更好的体验。<br />\n      在本次测试中有过充值付费行为的神位者大人，在游戏正式上线时使用与本次测试相同的账号在相同渠道（平台）登录，即可领取200%倍率的星晶石返还。具体的充值返利规则，请神位者大人详细阅读《空之旅人手游「命运测试」充值返还规则公告》。再次提醒大家妥善保管账号信息，以免造成损失。</p>\n\n<p><br />\n     再次感谢大家对于《空之旅人》项目的关注和支持。我们将悉心听取大家的建议，不断优化产品，将游戏更好的一面呈现给神位者大人。<br />\n <br />\n《空之旅人》运营团队<br />\n2021年2月2日</p>`

// rich.text = `<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">亲爱的冒险者：</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">唯美绚战MMORPG手游《无神之界》已正式开启公测！欢迎来到这片浪漫的异国大陆，体验联盟军的生活，开启全新的战争冒险吧！</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">不要忘记游戏里丰富多样的活动哦。我们为大家精心准备了众多活动，每日不停，豪礼不断，记得参加!</span></span></tt></p>\n\n<p><br />\n<tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">【七日签到】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">每日都登录，每日都有礼，更有机会获得绝版外观，传说武器，记得每天打卡哦！<br />\n活动说明：开启前七天，每日登陆游戏即可参与活动，获得极品道具。<br />\n<br />\n【全民嘉年华】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">全服庆典连开七天，玩转嘉年华，还能赢得海量道具，所有玩家一同欢庆开服！<br />\n活动说明：开服前七天，参与活动，即可获赠心动道具。<br />\n<br />\n【超值特权】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">最最最超值的玩家特权已上线，只要您购买超值特权卡，即可获得高级宝石，每日登录游戏还可领取大量钻石，尽显尊贵身份！<br />\n活动说明：购买超值特权卡后，即可获得奖励哦~<br />\n<br />\n【惊喜礼包】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">探索世界的同时还有意想不到的收获，这里藏着什么东西呢？超值道具一定给您惊吓，不对是惊喜！<br />\n活动说明：探索游戏触发限定隐藏礼包，购买后即可获得超值大礼包！<br />\n<br />\n【助战礼包】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">如此惊心动魄的冒险，您一定需要很多的战备物资吧，小艾琳用心的为您准备了助战礼包，帮助冒险者快速获得战斗所需道具，无后顾之忧！<br />\n活动说明：常驻礼包每日刷新，购买即得大量道具。<br />\n<br />\n【调查问卷】</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">小琳需要大家的帮忙啦！开心游戏的同时，能不能帮我完成KPI呢，那就是收集各位冒险者的宝贵反馈哦，当然不是无偿的，我拿出我最喜欢的红色钻石送给大家哦！</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">活动说明：等级问卷填写后可获得红钻*200，提交问卷后即可领取。</span></span></tt></p>\n\n<p><tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">再次感谢各位冒险家一直以来的陪伴与支持，我们由衷期待公测开服后将在“无神大陆”为大家创造更多有趣的体验，以及和小艾琳一同的珍贵回忆！</span></span></tt></p>\n\n<p style=\"text-align:right\"><br />\n<tt><span style=\"font-size:12rem\"><span style=\"color:#d6d6d6\">《无神之界》运营团队</span></span></tt><br />\n </p>`
rich.text = `<p>亲爱的神位者大人：</p>

<p>    欢迎参加《空之旅人》命运测试，本次测试为安卓计费删档测试，测试时间为2021年1月26日~2021年2月2日，测试期间游戏内将开启充值功能。在本次命运测试期间，神位者大人在游戏内的充值总金额，将在游戏正式上线后按照「充值返还规则」进行返还。</p>

<p> </p>

<p><strong><span>充值<span style="font-weight: normal">返还</span>规则明细</span>：</strong></p>

<p>    本次测试期间，<strong>您在</strong>游戏内充值的总金额（<strong style="font-size: 50px"><span style="color:#ff0000">含礼包、周卡</span></strong>）将按照1元=10星晶石的标准在游戏正式上线时返还<span style="color:#ff0000">200%</span>倍率的星晶石。（计算后若有小数则作进1处理）</p>

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
