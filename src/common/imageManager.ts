import Pool from './pool';
import { none } from './util';
import env from '../env';

type Callback = (img: HTMLImageElement, fromCache: boolean) => void;
interface ImageCache {
  img: HTMLImageElement;
  loadDone: boolean;
  onloadcbks: Callback[];
  onerrorcbks: Callback[];
}

class ImageManager {
  private imgPool = new Pool<ImageCache>('imgPool');
  
  getRes(src: string): ImageCache {
    return this.imgPool.get(src);
  }

  loadImagePromise(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve, reject) => {
      this.loadImage(src, resolve, reject);
    });
  }

  loadImage(src: string, success: Callback = none, fail: Callback = none): HTMLImageElement | null {
    if (!src) {
      return null;
    }

    let img: HTMLImageElement;
    const cache = this.getRes(src);

    // 图片已经被加载过，直接返回图片并且执行回调
    if (cache && cache.loadDone) {
      img = cache.img;
      success(img, true);
    } else if (cache && !cache.loadDone) {
      // 图片正在加载过程中，返回图片并且等待图片加载完成执行回调
      img = cache.img;

      cache.onloadcbks.push(success);
      cache.onerrorcbks.push(fail);
    } else {
      // 创建图片，将回调函数推入回调函数栈
      img = env.createImage() as HTMLImageElement;
      const newCache = {
        img,
        loadDone: false,
        onloadcbks: [success],
        onerrorcbks: [fail],
      }
     
      this.imgPool.set(src, newCache);

      img.onload = () => {
        newCache.loadDone = true;
        newCache.onloadcbks.forEach(fn => fn(img, false));
        newCache.onloadcbks = [];
        newCache.onerrorcbks = [];
      };

      img.onerror = () => {
        newCache.onerrorcbks.forEach(fn => fn(img, false));
        newCache.onerrorcbks = [];
        newCache.onloadcbks = [];
      };

      img.src = src;
    }

    return img;
  }
}

export default new ImageManager();
