cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    wx.loadSubpackage({
        name: name,
        success: function () {
            if (completeCallback) completeCallback();
        },
        fail: function () {
            if (completeCallback) completeCallback(new Error(`Failed to load subpackage ${name}`));
        }
    })
};

function downloadScript (item, callback, isAsync) {
    var url = '../../' + item.url;
    require(url);
    callback(null, item.url);
}

function loadFont (item) {
    var url = item.url;
    var fontFamily = wx.loadFont(url);
    return fontFamily || 'Arial';
}

function downloadImage (item, callback, isCrossOrigin) {
    if (isCrossOrigin === undefined) {
        isCrossOrigin = true;
    }

    var url = item.url;
    var img = new Image();
    if (isCrossOrigin && window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
    }
    else {
        img.crossOrigin = null;
    }

    function loadCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);

        img.id = item.id;
        callback(null, img);
    }
    function errorCallback () {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);

        // Retry without crossOrigin mark if crossOrigin loading fails
        // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.
        if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
            downloadImage(item, callback, false);
        }
        else {
            callback(new Error(cc.debug.getError(4930, url)));
        }
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = url;
}

function downloadWebp (item, callback) {
    if (!cc.sys.capabilities.webp) {
        return new Error(cc.debug.getError(4929, item.url));
    }
    return downloadImage(item, callback);
}

function downloadVideo (item, callback) {
    callback(null, item.url);
}

function loadVideo (item, callback) {
    callback(null, item.url);
}

cc.loader.downloader.addHandlers({
    js : downloadScript,
    png : downloadImage,
    jpg : downloadImage,
    bmp : downloadImage,
    jpeg : downloadImage,
    gif : downloadImage,
    ico : downloadImage,
    tiff : downloadImage,
    webp : downloadWebp,
    image : downloadImage,
    
    // Video
    mp4: downloadVideo,
    avi: downloadVideo,
    mov: downloadVideo,
    mpg: downloadVideo,
    mpeg: downloadVideo,
    rm: downloadVideo,
    rmvb: downloadVideo,
});

cc.loader.loader.addHandlers({
    // Video
    mp4: loadVideo,
    avi: loadVideo,
    mov: loadVideo,
    mpg: loadVideo,
    mpeg: loadVideo,
    rm: loadVideo,
    rmvb: loadVideo,

    // Font
    font: loadFont,
    eot: loadFont,
    ttf: loadFont,
    woff: loadFont,
    svg: loadFont,
    ttc: loadFont,
});
