/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var ID = 'WXDownloader';
const wxFsUtils = require('./wx-fs-utils');

const REGEX = /^\w+:\/\/.*/;

var packageFiles = null;
var cachedFiles = null;
var writeCacheFileList = null;
var cacheQueue = null;
var checkNextPeriod = false;
var errTest = /the maximum size of the file storage/;

var _newAssets = {};
var WXDownloader = window.WXDownloader = function () {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this.REMOTE_SERVER_ROOT = '';
    this.SUBCONTEXT_ROOT = '';
};
WXDownloader.ID = ID;

WXDownloader.prototype.init = function () {
    if (!CC_WECHATGAMESUB) {
        this.cacheDir = wx.env.USER_DATA_PATH + '/gamecaches';
        this.cachedFileName = 'cacheList.json';
        // whether or not cache asset into user's storage space
        this.cacheAsset = true;
        // cache one per cycle
        this.cachePeriod = 500;
        // whether or not storage space is run out of
        this.outOfStorage = false;

        this.writeFilePeriod = 2000;

        cacheQueue = {};
        packageFiles = {};

        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        cachedFiles = wxFsUtils.readJsonSync(cacheFilePath);
        if (cachedFiles instanceof Error) {
            cachedFiles = {};
            wxFsUtils.makeDirSync(this.cacheDir, true);
            wxFsUtils.writeFileSync(cacheFilePath, JSON.stringify(cachedFiles), 'utf8');
        }
    }
};

WXDownloader.prototype.handle = function (item, callback) {

    if (item.type === 'js') {
        return null;
    }
    if (item.type === 'uuid') {
        var result = cc.Pipeline.Downloader.PackDownloader.load(item, callback);
        // handled by PackDownloader
        if (result !== undefined) {
            // null result
            if (!!result) {
                return result;
            }
            else {
                return;
            }
        }
    }

    if (CC_WECHATGAMESUB) {
        // if wx.getFileSystemManager is undefined, need to skip
        if (REGEX.test(item.url)) {
            return null;
        }

        item.url = this.SUBCONTEXT_ROOT + '/' + item.url;
        if (wxFsUtils.checkFsValid()) return null;

        handleItem(item, callback);
        return;
    }

    readFromLocal(item, callback);
};

WXDownloader.prototype.cleanOldAssets = function () {
    cc.warn('wxDownloader.cleanOldAssets has been deprecated, please use wxDownloader.cleanOldCaches instead!');
    return this.cleanOldCaches();
};

WXDownloader.prototype.cleanOldCaches = function () {
    this.cleanAllCaches(_newAssets, function (err) {
        if (err) {
            cc.warn(err);
        }
        else {
            for (var path in _newAssets) {
                cc.log('reserve local file: ' + path);
            }
            cc.log('Clean old Assets successfully!');
        }
    });
};

function handleItem (item, callback) {
    if (item.type && !shouldReadFile(item.type)) {
        callback(null, null);
    }
    else {
        readFile(item, callback);
    }
}

WXDownloader.prototype.getCacheName = function (filePath) {
    var cacheUrlReg = /\//g;
    return filePath.replace(cacheUrlReg, '-');
};

WXDownloader.prototype.getCachedFileList = function () {
    return cachedFiles;
};

WXDownloader.prototype.cleanCache = function (filePath) {
    if (filePath in cachedFiles) {
        var self = this;
        delete cachedFiles[filePath];
        writeCacheFile(function () {
            if (filePath in cachedFiles) return;
            wxFsUtils.deleteFile(self.cacheDir + '/' + filePath, function (err) {
                if (!err) self.outOfStorage = false;
            });
        });
    }
};

WXDownloader.prototype.cleanAllAssets = function () {
    cc.warn('wxDownloader.cleanAllAssets has been deprecated, please use cleanAllCaches instead!');
    this.cleanAllCaches(null, function (err) {
        if (err) cc.error(err.message);
    });
};

WXDownloader.prototype.cleanAllCaches = function (exclude, callback) {
    exclude = exclude || {};
    var self = this;
    var result = wxFsUtils.readDir(self.cacheDir, function (err, list) {
        if (err) {
            callback && callback(err);
            return;
        }
        var toDelete = [];
        for (var i = 0, l = list.length; i < l; i ++) {
            var path = list[i];
            if (path === self.cachedFileName) continue;
            if (path in exclude) continue;
            if (path in cacheQueue) {
                delete cacheQueue[path];
                continue;
            }
            delete cachedFiles[path];
            toDelete.push(path);
        }
        writeCacheFile(function () {
            var count = 0;
            for (var i = 0, l = toDelete.length; i < l; i ++) {
                if (toDelete[i] in cachedFiles) {
                    count++;
                    if (count === l) {
                        self.outOfStorage = false;
                        callback && callback(null);
                    }
                    continue;
                }
                wxFsUtils.deleteFile(self.cacheDir + '/' + toDelete[i], function (err) {
                    count++;
                    if (count === l) {
                        self.outOfStorage = false;
                        callback && callback(null);
                    }
                });
            }
        });
    });
    if (result) callback(result);
};

var wxDownloader = window.wxDownloader = new WXDownloader();

function registerFailHandler (item, cachePath) {
    var queue = cc.LoadingItems.getQueue(item);
    queue.addListener(item.id, function (item) {
        if (item.error) {
            if (item.url in cacheQueue) {
                delete cacheQueue[item.url];
            }
            else {
                wxDownloader.cleanCache(cachePath);
            }
        }
    });
}

function readFile (item, callback) {
    var url = item.url;
    var func = wxFsUtils.readText;
    if (getFileType(item.type) === FileType.BIN) func = wxFsUtils.readArrayBuffer;
    var result = func(url, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        if (data) {
            item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.COMPLETE;
            callback(null, data);
        }
        else {
            callback(new Error("Empty file: " + url));
        }
    });
    if (result) callback(result);
}

function readFromLocal (item, callback) {
    var result = wxFsUtils.checkFsValid();
    if (result) {
        callback(result);
        return;
    }

    var cachedPath = wxDownloader.getCacheName(item.url);

    if (cachedPath in cachedFiles) {
        // cache new asset
        _newAssets[cachedPath] = true;
        item.url = wxDownloader.cacheDir + '/' + cachedPath;
        registerFailHandler(item, cachedPath);
        handleItem(item, callback);
    }
    else {
        function seek (inPackage) {
            if (inPackage) {
                handleItem(item, callback);
            }
            else {
                if (!wxDownloader.REMOTE_SERVER_ROOT) {
                    callback(null, null);
                    return;
                }
                downloadRemoteFile(item, callback);
            }
        }
    
        if (item.url in packageFiles) {
            seek(packageFiles[item.url]);
        }
        else {
            wxFsUtils.exists(item.url, function (existance) {
                packageFiles[item.url] = existance;
                seek(existance);
            });
        }
    }
}

function cacheFile (url, isCopy, cachePath) {
    cacheQueue[url] = { isCopy, cachePath };

    if (!checkNextPeriod) {
        checkNextPeriod = true;
        function cache () {
            for (var srcUrl in cacheQueue) {
                if (!wxDownloader.outOfStorage) {
                    var item = cacheQueue[srcUrl]
                    var localPath = wxDownloader.cacheDir + '/' + item.cachePath;
                    var func = wxFsUtils.copyFile;
                    if (!item.isCopy) func = wxFsUtils.downloadFile; 
                    func(srcUrl, localPath, function (err) {
                        checkNextPeriod = false;
                        if (err)  {
                            if (errTest.test(err.message)) {
                                wxDownloader.outOfStorage = true;
                                return;
                            }
                        } else {
                            cachedFiles[item.cachePath] = 1;
                            delete cacheQueue[srcUrl];
                            writeCacheFile();
                        }
                        if (!cc.js.isEmptyObject(cacheQueue)) {
                            checkNextPeriod = true;
                            setTimeout(cache, wxDownloader.cachePeriod);
                        }
                    });
                }
                else {
                    checkNextPeriod = false;
                }
                return;
            }
            checkNextPeriod = false;
        };
        setTimeout(cache, wxDownloader.cachePeriod);
    }
}

function downloadRemoteFile (item, callback) {
    // Download from remote server
    var relatUrl = item.url;

    // filter protocol url (E.g: https:// or http:// or ftp://)
    if (REGEX.test(relatUrl)) {
        callback(null, null);
        return;
    }

    var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
    item.url = remoteUrl;
    var cachePath = wxDownloader.getCacheName(relatUrl);
    if (cc.sys.os === cc.sys.OS_ANDROID && item.type && getFileType(item.type) === FileType.IMAGE) {
        if (wxDownloader.cacheAsset) {
            cacheFile(remoteUrl, false, cachePath);
            registerFailHandler(item, cachePath);
        }
        callback(null, null);
    }
    else {
        wxFsUtils.downloadFile(remoteUrl, undefined, function (err, path) {
            if (err) {
                callback(err, null);
                return;
            }
            item.url = path;
            if (wxDownloader.cacheAsset) {
                cacheFile(path, true, cachePath);
                registerFailHandler(item, cachePath);
            }
            handleItem(item, callback);
        });
    }
    
}

var callbacks = [];
var nextCallbacks = [];
var startWrite = false;
function writeCacheFile (cb) {
    function write () {
        writeCacheFileList = null;
        startWrite = true;
        wxFsUtils.writeFile(wxDownloader.cacheDir + '/' + wxDownloader.cachedFileName, JSON.stringify(cachedFiles), 'utf8', function () {
            startWrite = false;
            for (let i = 0, j = callbacks.length; i < j; i++) {
                callbacks[i]();
            }
            callbacks.length = 0;
            callbacks.push.apply(callbacks, nextCallbacks);
            nextCallbacks.length = 0;
        });
    }
    if (!writeCacheFileList) {
        writeCacheFileList = setTimeout(write, wxDownloader.writeFilePeriod);
        if (startWrite === true) {
            cb && nextCallbacks.push(cb);
        }
        else {
            cb && callbacks.push(cb);
        }
    } else {
        cb && callbacks.push(cb);
    }
}

function shouldReadFile (type) {
    return getFileType(type) >= FileType.LOADABLE_MIN;
}

function getFileType (type) {
    return (map[type] || FileType.DEFAULT);
}

var FileType = {
    'IMAGE': 1,
    'FONT': 2,
    'AUDIO': 3,
    'SCRIPT': 4,
    'VIDEO': 5,
    'TEXT': 6,
    'BIN': 7,
    'DEFAULT': 8,
    'LOADABLE_MIN': 6
};

var map = {
    // JS
    'js' : FileType.SCRIPT,

    // Images
    'png' : FileType.IMAGE,
    'jpg' : FileType.IMAGE,
    'bmp' : FileType.IMAGE,
    'jpeg' : FileType.IMAGE,
    'gif' : FileType.IMAGE,
    'ico' : FileType.IMAGE,
    'tiff' : FileType.IMAGE,
    'webp' : FileType.IMAGE,
    'image' : FileType.IMAGE,

    // Audio
    'mp3' : FileType.AUDIO,
    'ogg' : FileType.AUDIO,
    'wav' : FileType.AUDIO,
    'm4a' : FileType.AUDIO,
    
    // Video
    'mp4' : FileType.VIDEO,
    'avi' : FileType.VIDEO,
    'mov' : FileType.VIDEO,
    'mpg' : FileType.VIDEO,
    'mpeg' : FileType.VIDEO,
    'rm' : FileType.VIDEO,
    'rmvb' : FileType.VIDEO,

    // Txt
    'txt' : FileType.TEXT,
    'xml' : FileType.TEXT,
    'vsh' : FileType.TEXT,
    'fsh' : FileType.TEXT,
    'atlas' : FileType.TEXT,

    'tmx' : FileType.TEXT,
    'tsx' : FileType.TEXT,

    'json' : FileType.TEXT,
    'ExportJson' : FileType.TEXT,
    'plist' : FileType.TEXT,

    'fnt' : FileType.TEXT,

    // Font
    'font' : FileType.FONT,
    'eot' : FileType.FONT,
    'ttf' : FileType.FONT,
    'woff' : FileType.FONT,
    'svg' : FileType.FONT,
    'ttc' : FileType.FONT,

    // Binary
    'binary' : FileType.BIN,
    'dbbin' : FileType.BIN,
    'bin': FileType.BIN,
    'pvr': FileType.BIN,
    'pkm': FileType.BIN
};
