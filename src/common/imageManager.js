import Pool from './pool';
import { none, createImage } from './util';

const imgPool = new Pool('imgPool');

class ImageManager {
  getRes(src) {
    return imgPool.get(src);
  }

  loadImagePromise(src) {
    return new Promise((resolve, reject) => {
      this.loadImage(src, resolve, reject);
    });
  }

  loadImage(src, callback = none, fail = none) {
    let img = null;
    const cache = this.getRes(src);

    if (!src) {
      return img;
    }

    // 图片已经被加载过，直接返回图片并且执行回调
    if (cache && cache.loadDone) {
      img = cache;
      callback(img, true);
    } else if (cache && !cache.loadDone) {
      // 图片正在加载过程中，返回图片并且等待图片加载完成执行回调
      img = cache;

      cache.onloadcbks.push(callback);
      cache.onerrorcbks.push(fail);
    } else {
      // 创建图片，将回调函数推入回调函数栈
      img = createImage();
      img.onloadcbks = [callback];
      img.onerrorcbks = [fail];
      imgPool.set(src, img);

      img.onload = () => {
        img.loadDone = true;
        img.onloadcbks.forEach(fn => fn(img, false));
        img.onloadcbks = [];
        img.onerrorcbks = [];
      };

      img.onerror = () => {
        img.onerrorcbks.forEach(fn => fn(img, false));
        img.onerrorcbks = [];
        img.onloadcbks = [];
      };

      img.src = src;
    }

    return img;
  }
}

export default new ImageManager();
