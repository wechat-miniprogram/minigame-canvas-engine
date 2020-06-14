const { createCanvas, loadImage, Image } = require('canvas')
let Layout = require('../src/index').default;
const fs = require('fs')
const path = require('path')

document.createCanvas = createCanvas;

console.log(Image, document.createCanvas)

global.Image = Image;

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')
let template = `
    <view id="container">
    <text id="testText" class="redText" value="hello canvas"></text>
    </view>
`

let style = {
    container: {
        width: 200,
        height: 100,
        backgroundColor: '#ffffff',
        justContent: 'center',
        alignItems: 'center',
    },
    testText: {
        color: '#ffffff',
        width: 200,
        height: 50,
        lineHeight: 50,
        fontSize: 20,
        textAlign: 'center',
    },
    // 文字的最终颜色为#ff0000
    redText: {
        color: '#ff0000',
    }
}


describe('imageManager.js', function() {
  it('should render to canvas', function() {
    Layout.init(template, style);
    Layout.layout(ctx);
    const buf2 = canvas.toBuffer('image/png')
    fs.writeFileSync(path.normalize(__dirname + '/test.png'), buf2, 'utf-8');
  });
});
