const pools = [];

export default class Pool {
  constructor(name = 'pool') {
    let curr = pools.find( item => item.name === name );

    if ( curr ) {
      return curr;
    }

    this.name = name;
    this.pool = {};

    pools.push(this);
  }

  get(key) {
    return this.pool[key];
  }

  set(key, value) {
    this.pool[key] = value;
  }

  clear() {
    this.pool = {};
  }

  getList() {
    return Object.values(this.pool);
  }
}
