# API

## LayoutAPI

### getElementsById
#### Layout.getElementsById(String elementId)
获取元素id为**elementId**的一组元素

### getElementsByClassName
#### Layout.getElementsByClassName(String className)
获取包含class为**className**的一组元素

### Layout.clear()
清理画布，之前的计算出来的渲染树也会一并清理，此时可以再次执行init和layout方法渲染界面。

### Layout.clearPool()
调用此API可以清理对象池，释放内存

### Layout.clearAll()
等价于按序调用Layout.clear和Layout.clearPool.

### Layout.loadImgs(Array imgarr)
对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验。通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
```
// 注意图片路径不需要加./作为前缀，以小游戏根目录作为根目录
Layout.loadImgs([
    'sub/Buffet_icon_GiftPlate_0.png',
    'sub/Buffet_icon_GiftPlate.png',
    'sub/UI_Icon_Rating.png',
]);

```

### registBitMapFont

#### Layout.registBitMapFont(name, src, config)

| keyName  | 类型     |  描述    |
|----------|----------| ---------|
| name| String| 字体的名称|
| src| String| bitMapFont字体的图片链接|
| config| String| BitMapFont的配置信息|

``` js
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

```


### 事件API
通过getElementsById或者getElementsByClassName获取元素之后，可以的绑定事件，支持的事件有`touchstart`、`touchmove`、`touchend`、`touchcancel`、`click`,示例如下：
``` js
const list = Layout.getElementsByClassName('listItem');

list.forEach(item => {
    item.on('touchstart', (e) => {
        console.log(e, item);
    });
});
```

### 属性API
通过Layout.getElementsById和Layout.getElementsByClassName获取image和text之后，修改图片的链接或者文本的值会自动重渲染界面。
``` js
let img = Layout.getElementsById('testimgid')[0];
img.src = 'newimgsrc';

let text = Layout.getElementsById('tesettextid')[0];
text.value = 'newtextvalue';
```

