export default class Pool {
    constructor(name = 'pool') {
        this.name = name;
        this.pool = {};
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
}
