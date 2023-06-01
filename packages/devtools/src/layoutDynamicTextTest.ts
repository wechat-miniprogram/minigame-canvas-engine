
function main() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    document.body.append(canvas);

    Layout.clear();
    // 初始化引擎
    Layout.init('<view class="root" ></view>', {root: {width: 400, height: 400}});
    // 设置canvas的尺寸和样式的container比例一致
    canvas.width = 400;
    canvas.style.width = '400px';
    canvas.height = 400;
    canvas.style.height = '400px';
    
    Layout.updateViewPort(canvas.getBoundingClientRect());
    Layout.layout(context);
    const root = Layout.getElementsByClassName('root')[0];
    const text = new Layout.Text({value: '0', className: 'text2'});
    text.root = root;
    root.appendChild(text);

    setTimeout(function() {
        Layout.getElementsByClassName('text2')[0].value = 'sssssssssssssss';
    }, 1000)
}

main();
