export default class Ticker {
  constructor() {
    this.count = 0;
    this.started = false;
    this.animationId = null;

    this.cbs = [];

    this.update = () => {
      this.cbs.forEach((cb) => {
        cb();
      });

      this.count += 1;
      this.animationId = requestAnimationFrame(this.update);
    };
  }

  cancelIfNeed() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  add(cb) {
    if (typeof cb === 'function' && this.cbs.indexOf(cb) === -1) {
      this.cbs.push(cb);
    }
  }

  remove(cb) {
    if (typeof cb === 'function' && this.cbs.indexOf(cb) > -1) {
      this.cbs.splice(this.cbs.indexOf(cb), 1);
    }

    if (!this.cbs.length) {
      this.cancelIfNeed();
    }
  }

  start() {
    if (!this.started) {
      this.started = true;

      if (this.animationId === null && this.cbs.length) {
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
