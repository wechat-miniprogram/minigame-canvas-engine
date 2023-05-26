const pools: Pool<any>[] = [];

export default class Pool<T> {
  public name = 'pool'
  public pool: { [key: string]: T } = {};

  constructor(name = 'pool') {
    const curr = pools.find(item => item.name === name);

    if (curr) {
      return curr;
    }

    this.name = name;
    this.pool = {};

    pools.push(this);
  }

  get(key: string): T {
    return this.pool[key];
  }

  set(key: string, value: T) {
    this.pool[key] = value;
  }

  clear() {
    this.pool = {};
  }

  getList(): T[] {
    return Object.values(this.pool);
  }
}
