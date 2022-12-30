export default class DebugInfo {
  constructor() {
    this.info = {};
    this.totalStart = 0;
    this.totalCost = 0;
  }

  start(name) {
    if (this.totalStart === 0) {
      this.totalStart = Date.now();
    }

    this.info[name] = {
      start: Date.now(),
    };
  }

  end(name) {
    if (this.info[name]) {
      this.info[name].end = Date.now();

      this.info[name].cost = this.info[name].end - this.info[name].start;

      this.totalCost = this.info[name].end - this.totalStart;
    }
  }

  log() {
    let logInfo = 'Layout debug info: \n';
    logInfo += Object.keys(this.info).reduce((sum, curr) => {
      // eslint-disable-next-line no-param-reassign
      sum += `${curr}: ${this.info[curr].cost}\n`;

      return sum;
    }, '');

    // eslint-disable-next-line no-unused-vars
    logInfo += `totalCost: ${this.totalCost}`;

    console.log(logInfo);
  }
}
