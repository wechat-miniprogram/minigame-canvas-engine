import Pool     from './pool';
import { none, createImage } from './util';

const imgPool = new Pool('imgPool');

class ImageManager {
  getRes(src) {
    return imgPool.get(src);
  }

  loadImage(src, callback = none) {
    let img     = null;
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
    } else {
      // 创建图片，将回调函数推入回调函数栈
      img = createImage();
      img.onloadcbks = [callback];
      imgPool.set(src, img);

      img.onload = () => {
        img.loadDone   = true;
        img.onloadcbks.forEach(fn => fn(img, false));
        img.onloadcbks = [];
      };

      img.onerror = (e) => {
        console.log('img load error', e);
      };

      img.src = src;
    }

    return img;
  }
}

export default new ImageManager();
