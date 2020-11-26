import { getDpr } from './util.js';
const dpr = getDpr();

export default class Touch {
  constructor() {
    this.needProcess = false;

    this.startFunc = this.touchStartHandler.bind(this);
    this.endFunc   = this.touchEndHandler.bind(this);
    this.moveFunc  = this.touchMoveHandler.bind(this);

    this.touchDirection = "X";
  }

  reset() {
    this.touchTime   = new Date();
    this.touchStartX = 0;
    this.touchStartY = 0;

    // 滚动区间
    this.start = 0;
    this.end   = 0;

    // 当前位置
    this.move   = 0;
    // 目标位置
    this.target = 0;

    // 滚动回调函数
    this.scroll = null;

    // for istanbul
    /* istanbul ignore if*/
    if ( typeof cancelAnimationFrame !== 'undefined' ) {
      cancelAnimationFrame(this.animate);
    }
  }

  enable() {
    this.reset();
    this.needProcess = true;
  }

  disable() {
    this.needProcess = false;
  }

  // 设置滚动区间，比如一个排行榜的滚动区间可能是[-300, 0]
  setTouchRange(start, end, scroll) {
    // 考虑到切换游戏的场景，每次设置的时候重置所有变量
    this.enable();

    this.start = start;
    this.end   = end;

    if ( start === 0 && end === 0 ) {
      return;
    }

    this.scroll = scroll;
  }

  // 保证滚动目标位置在滚动区间内
  limitTarget(target) {
    let result = target;

    if ( target > this.end ) {
      result = this.end;
    } else if ( target < this.start ) {
      result = this.start;
    }

    return result;
  }

  touchStartHandler(e) {
    const touch = (e.touches && e.touches[0]) ||( e.changedTouches &&  e.changedTouches[0]) || e;
    if ( !touch || !touch.pageX || !touch.pageY ) {
      return;
    }

    this.touchStartX = touch.clientX * dpr;
    this.touchStartY = touch.clientY * dpr;
    this.touchTime   = new Date();
    this.isMoving    = true;
    this.needProcess = true;
    this.animate     = requestAnimationFrame(this.loop.bind(this));
  }

  touchMoveHandler(e) {
    if ( !this.isMoving ) {
      return;
    }
    const touch = (e.touches && e.touches[0]) ||( e.changedTouches &&  e.changedTouches[0]) || e;
    if ( !touch || !touch.pageX || !touch.pageY ) {
      return;
    }

    let currY = touch.clientY * dpr;

    let currX = touch.clientX * dpr;

    if (this.touchDirection === "Y") {
      if (   this.touchStartY - currY > 2
        || this.touchStartY - currY < -2 ) {
        this.target -= (this.touchStartY - currY);
      }

      this.target      = this.limitTarget(this.target);
      this.touchStartY = currY;
    } else {
      if (   this.touchStartX - currX > 2
        || this.touchStartX - currX < -2 ) {
        this.target -= (this.touchStartX - currX);
      }

      this.target      = this.limitTarget(this.target);
      this.touchStartX = currX;
    }
  }

  touchEndHandler() {
    this.isMoving = false;

    const timeInS = ( Date.now() - this.touchTime ) / 1000;
    /*console.log(Date.now(), this.touchTime.getTime(), Date.now() - this.touchTime);*/
    if ( timeInS < 0.9 ) {
      /*console.log(1, timeInS, this.target, this.move);*/
      this.target += (this.target - this.move) * 0.6 / (timeInS * 5);
      /*console.log(2, this.target)*/

      this.target = this.limitTarget(this.target);
      /*console.log(3, this.target)*/
    }
  }

  loop() {
    if ( this.needProcess ) {
      if ( this.isMoving ) {
        if ( this.move !== this.target ) {
          // 手指移动可能过快，切片以使得滑动流畅
          if ( Math.abs(this.target - this.move ) > 1 ) {
            this.move += (this.target - this.move ) * 0.4;
          } else {
            this.move = this.target;
          }
          this.scroll && this.scroll(this.move);
        }

      } else {
        if ( this.move !== this.target ) {
          /**
           * 如果滑动很快，为了滚动流畅，需要将滑动过程切片
           */
          if ( Math.abs(this.target - this.move ) > 1 ) {
            this.move += (this.target - this.move ) * 0.3;
          } else {
            this.move = this.target;
          }

          this.scroll && this.scroll(this.move);
        } else {
          // 滑动结束，停止动画
          this.needProcess = false;
        }
      }

      this.animate = requestAnimationFrame(this.loop.bind(this));
    } else if ( typeof cancelAnimationFrame !== 'undefined' ) {
      cancelAnimationFrame(this.animate);
    }
  }
}
