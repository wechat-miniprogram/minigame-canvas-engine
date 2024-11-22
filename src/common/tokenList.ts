class TokenList {
  public tokens: Set<string>

  constructor(initialTokens: string) {
    this.tokens = new Set(initialTokens || []);
  }

  // 返回列表中的令牌数
  get length() {
    return this.tokens.size;
  }

  // 获取令牌列表的值（values）数组
  get values() {
    return Array.from(this.tokens);
  }

  // 将令牌列表转换为字符串
  get value() {
    return Array.from(this.tokens).join(' ');
  }

  // 添加一个令牌
  add(token: string) {
    this.tokens.add(token);
  }

  // 检查列表中是否存在指定的令牌
  contains(token: string) {
    return this.tokens.has(token);
  }

  // 删除一个令牌
  remove(token: string) {
    this.tokens.delete(token);
  }
}
