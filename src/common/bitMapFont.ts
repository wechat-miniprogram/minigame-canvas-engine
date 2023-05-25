import imageManager from './imageManager';
const Emitter = require('tiny-emitter');

interface CharData {
  x: number;
  y: number;
  w: number;
  h: number;
  offX: number;
  offY: number;
  xadvance: number;
  kerning: { [key: string]: number };
}

interface Chars {
  [key: string]: CharData;
}

type ConfigLineData = {
  line: string[];
  index: number;
};


/**
 * http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
export default class BitMapFont {
  private config: string;
  public event: any;

  public chars: Chars;

  public ready = false;
  public texture: HTMLImageElement | null;
  public lineHeight?: number;
  public fontSize?: number;


  // pool的实现放到类里面实现并不优雅，先去掉了
  constructor(name: string, src: string, config: string) {
    this.config = config;
    this.chars = this.parseConfig(config);
    this.event = new Emitter();

    this.texture = imageManager.loadImage(src, (texture, fromCache) => {
      if (fromCache) {
        this.texture = texture;
      }
      this.ready = true;
      this.event.emit('text__load__done');
    });
  }

  parseConfig(fntText: string) {
    fntText = fntText.split('\r\n').join('\n');
    const lines: string[] = fntText.split('\n');
    const linesParsed: string[][] = lines.map(line => line.trim().split(' '));

    const charsLine: ConfigLineData = this.getConfigByLineName(linesParsed, 'chars');
    const charsCount: number = this.getConfigByKeyInOneLine(charsLine.line, 'count');

    const commonLine: ConfigLineData = this.getConfigByLineName(linesParsed, 'common');
    this.lineHeight = this.getConfigByKeyInOneLine(commonLine.line, 'lineHeight');

    const infoLine: ConfigLineData = this.getConfigByLineName(linesParsed, 'info');
    this.fontSize = this.getConfigByKeyInOneLine(infoLine.line, 'size');

    // 接卸 kernings
    const kerningsLine: ConfigLineData = this.getConfigByLineName(linesParsed, 'kernings');
    let kerningsCount = 0;
    let kerningsStart = -1;
    if (kerningsLine.line) {
      kerningsCount = this.getConfigByKeyInOneLine(kerningsLine.line, 'count');
      kerningsStart = kerningsLine.index + 1;
    }

    const chars: Chars = {};
    for (let i = 4; i < 4 + charsCount; i++) {
      const charText: string = lines[i];
      const letter: string = String.fromCharCode(this.getConfigByKeyInOneLine(charText, 'id'));

      const c: CharData = {
        x: this.getConfigByKeyInOneLine(charText, 'x'),
        y: this.getConfigByKeyInOneLine(charText, 'y'),
        w: this.getConfigByKeyInOneLine(charText, 'width'),
        h: this.getConfigByKeyInOneLine(charText, 'height'),
        offX: this.getConfigByKeyInOneLine(charText, 'xoffset'),
        offY: this.getConfigByKeyInOneLine(charText, 'yoffset'),
        xadvance: this.getConfigByKeyInOneLine(charText, 'xadvance'),
        kerning: {}
      };
      chars[letter] = c;
    }

    // parse kernings
    if (kerningsCount) {
      for (let i = kerningsStart; i <= kerningsStart + kerningsCount; i++) {
        const line: string[] = linesParsed[i];
        const first: string = String.fromCharCode(this.getConfigByKeyInOneLine(line, 'first'));
        const second: string = String.fromCharCode(this.getConfigByKeyInOneLine(line, 'second'));
        const amount: number = this.getConfigByKeyInOneLine(line, 'amount');

        if (chars[second]) {
          chars[second].kerning[first] = amount;
        }
      }
    }

    return chars;
  }

  getConfigByLineName(linesParsed: string[][], lineName = ''): ConfigLineData {
    let index = -1;
    let line: string[] = [];
    const len = linesParsed.length;

    for (let i = 0; i < len; i++) {
      const item: string[] = linesParsed[i];

      if (item[0] === lineName) {
        index = i;
        line = item;
      }
    }

    return {
      line,
      index,
    };
  }

  getConfigByKeyInOneLine(configText: string[] | string, key: string) {
    const itemConfigTextList = Array.isArray(configText) ? configText : configText.split(' ');

    for (let i = 0, { length } = itemConfigTextList; i < length; i++) {
      const itemConfigText = itemConfigTextList[i];
      if (key === itemConfigText.substring(0, key.length)) {
        const value = itemConfigText.substring(key.length + 1);
        return parseInt(value);
      }
    }

    return 0;
  }
}
