interface DebugInfoItem {
  start: number;
  isInner: boolean;
  end?: number;
  cost?: number;
}

export default class DebugInfo {
  public info: { [key: string]: DebugInfoItem } = {};
  public totalStart: number = 0;
  public totalCost: number = 0;

  constructor() {
    this.reset();
  }

  start(name: string, isInner: boolean = false) {
    if (this.totalStart === 0) {
      this.totalStart = Date.now();
    }

    this.info[name] = {
      start: Date.now(),
      isInner,
    };
  }

  end(name: string) {
    if (this.info[name]) {
      this.info[name].end = Date.now();
      this.info[name].cost = (this.info[name].end as number) - this.info[name].start;
      this.totalCost = (this.info[name].end as number) - this.totalStart;
    }
  }

  reset(): void {
    this.info = {};
    this.totalStart = 0;
    this.totalCost = 0;
  }

  log(needInner: boolean = false): string {
    let logInfo = 'Layout debug info: \n';
    logInfo += Object.keys(this.info).reduce((sum, curr) => {
      if (this.info[curr].isInner && !needInner) {
        return sum;
      }
      sum += `${curr}: ${this.info[curr].cost}\n`;
      return sum;
    }, '');

    logInfo += `totalCost: ${this.totalCost}\n`;

    return logInfo;
  }
}
