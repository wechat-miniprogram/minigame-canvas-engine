class TokenList {
    constructor(initialTokens) {
      this.tokens = new Set(initialTokens || []);
    }
  
    // 添加一个令牌
    add(token) {
      this.tokens.add(token);
    }
  
    // 删除一个令牌
    remove(token) {
      this.tokens.delete(token);
    }
  
    // 检查列表中是否存在指定的令牌
    contains(token) {
      return this.tokens.has(token);
    }
  
    // 返回列表中的令牌数
    get length() {
      return this.tokens.size;
    }
  
    // 将令牌列表转换为字符串
    toString() {
      return Array.from(this.tokens).join(' ');
    }
  
    // 获取令牌列表的值（values）数组
    get values() {
      return Array.from(this.tokens);
    }
  
    // 将字符串转换为令牌列表
    static fromString(str) {
      return new TokenList(str.split(/\s+/));
    }
  }