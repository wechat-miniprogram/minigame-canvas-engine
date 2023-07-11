import { Callback } from "../types";

export default class Ticker {
  private count: number = 0;
  private started: boolean = false;
  private animationId: number | null = null;

  private cbs: Callback[] = [];
  private nextCbs: Callback[] = [];
  private innerCbs: Callback[] = [];

  private lastTime!: number;

  private update = () => {
    const time = Date.now();
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    // console.log(dt)
    // 优先执行业务的ticker回调，因为有可能会触发reflow
    this.cbs.forEach((cb: Callback) => {
      cb(deltaTime);
    });

    this.innerCbs.forEach((cb: Callback) => {
      cb(deltaTime);
    });

    if (this.nextCbs.length) {
      this.nextCbs.forEach(cb => cb(deltaTime));

      this.nextCbs = [];
    }

    this.count += 1;
    this.animationId = requestAnimationFrame(this.update);
  }

  cancelIfNeed() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  add(cb: Callback, isInner = false) {
    if (typeof cb === 'function' && this.cbs.indexOf(cb) === -1) {
      isInner ? this.innerCbs.push(cb) :  this.cbs.push(cb);
    }
  }

  next(cb: Callback) {
    if (typeof cb === 'function') {
      this.nextCbs.push(cb);
    }
  }

  remove(cb?: Callback, isInner = false) {
    if (cb === undefined) {
      this.cbs = [];
      this.innerCbs = [];
      this.nextCbs = [];
    }

    if (typeof cb === 'function' && (this.cbs.indexOf(cb) > -1 || this.innerCbs.indexOf(cb) > -1)) {
      const list = isInner ? this.innerCbs : this.cbs;
      list.splice(this.cbs.indexOf(cb), 1);
    }

    if (!this.cbs.length && !this.innerCbs.length) {
      this.cancelIfNeed();
    }
  }

  start() {
    if (!this.started) {
      this.started = true;

      this.lastTime = Date.now();

      if (this.animationId === null && (this.cbs.length || this.innerCbs.length)) {
        this.animationId = requestAnimationFrame(this.update);
      }
    }
  }

  stop() {
    if (this.started) {
      this.started = false;

      this.cancelIfNeed();
    }
  }
}

export const sharedTicker = new Ticker();
