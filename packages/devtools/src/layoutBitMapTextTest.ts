import { template } from 'dot';

function main() {
  let tpl = `
    <view id="container">
    <bitmaptext font="fnt_number-export" class="title" value="等级0123456789"></bitmaptext>
  </view>
  `

  let style = {
    container: {
      width: 400,
      height: 200,
      backgroundColor: '#ffffff',
      justContent: 'center',
      alignItems: 'center',
    },
    title: {
      width: 400,
      fontSize: 30,
      height: 200,
      lineHeight: 30,
      textAlign: 'center',
      verticalAlign: 'middle',
    }
  }

  // @ts-ignore
  const Layout = window.Layout;

  Layout.registBitMapFont(
    'fnt_number-export',
    'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20200314/fnt_number-export.png',
    `info face="fnt_number-export" size=50 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1
    common lineHeight=60 base=26 scaleW=190 scaleH=181 pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
    page id=0 file="fnt_number-export.png"
    chars count=15
    char id=31561 x=0 y=61 width=60 height=61 xoffset=0 yoffset=2 xadvance=57 page=0 chnl=0 letter="等"
    char id=32423 x=0 y=0 width=62 height=60 xoffset=0 yoffset=2 xadvance=59 page=0 chnl=0 letter="级"
    char id=46 x=168 y=116 width=21 height=21 xoffset=0 yoffset=39 xadvance=18 page=0 chnl=0 letter="."
    char id=49 x=145 y=0 width=27 height=57 xoffset=0 yoffset=3 xadvance=24 page=0 chnl=0 letter="1"
    char id=50 x=44 y=123 width=41 height=57 xoffset=0 yoffset=3 xadvance=38 page=0 chnl=0 letter="2"
    char id=51 x=102 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="3"
    char id=52 x=143 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="4"
    char id=53 x=0 y=123 width=43 height=57 xoffset=0 yoffset=3 xadvance=40 page=0 chnl=0 letter="5"
    char id=54 x=127 y=116 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="6"
    char id=55 x=86 y=119 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="7"
    char id=56 x=63 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="8"
    char id=57 x=104 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="9"
    char id=48 x=61 y=61 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="0"
    char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter=" "
    char id=9 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter="	"
    
    kernings count=0`
  )

  Layout.init(template(tpl)({}), style);

  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  document.body.append(canvas)

  // 设置canvas的尺寸和样式的container比例一致
  canvas.style.width = 600 / 2 + 'px';
  canvas.style.height = 600 / 2 + 'px';
  canvas.width = 600;
  canvas.height = 600;

  Layout.updateViewPort(canvas.getBoundingClientRect());

  Layout.layout(context);
}

main();
