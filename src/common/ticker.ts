import { Callback } from "../types";

export default class Ticker {
  private count: number = 0;
  private started: boolean = false;
  private animationId: number | null = null;

  private cbs: Callback[] = [];
  private innerCbs: Callback[] = [];
  private nextCbs: Callback[] = [];
  private innerNextCbs: Callback[] = [];

  private lastTime!: number;

  private residueStep!:number; //剩余的执行步数，== 0 时候停止循环，小于0 不限制

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

    if (this.innerNextCbs.length) {
      this.innerNextCbs.forEach(cb => cb(deltaTime));
      this.innerNextCbs = [];
    }

    if (this.nextCbs.length) {
      this.nextCbs.forEach(cb => cb(deltaTime));

      this.nextCbs = [];
    }

    this.count += 1;
    this.residueStep --;
    if(this.residueStep !== 0){
      this.animationId = requestAnimationFrame(this.update);
    }else{
      this.animationId = null;
      this.started = false;
    }

  }

  cancelIfNeed() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  add(cb: Callback, isInner = false) {
    if (typeof cb === 'function' && this.cbs.indexOf(cb) === -1) {
      isInner ? this.innerCbs.push(cb) : this.cbs.push(cb);
    }
  }

  next(cb: Callback, isInner = false) {
    if (typeof cb === 'function') {
      isInner ? this.innerNextCbs.push(cb) : this.nextCbs.push(cb);
    }
  }

  removeInner() {
    this.innerCbs = [];
    this.innerNextCbs = [];
  }

  remove(cb?: Callback, isInner = false) {
    if (cb === undefined) {
      this.cbs = [];
      this.innerCbs = [];
      this.nextCbs = [];
      this.innerNextCbs = [];
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
    this.frame(-1);
  }

  stop() {
    if (this.started) {
      this.started = false;
      this.cancelIfNeed();
    }
  }

  /**
   * 单步执行, 指定需要执行的帧数，用户改变数据后刷新使用，不需要一致执行循环
   *
   * @param step 0 不执行，负数，无限执行 正数执行指定桢后停止
   */
  frame(step:number){
    if(this.started || step === 0){
      return;
    }
    this.started = true;
    this.lastTime = Date.now();
    this.residueStep = step;
    if (this.animationId === null && (this.cbs.length || this.innerCbs.length)) {
      this.animationId = requestAnimationFrame(this.update);
    }
  }


}
