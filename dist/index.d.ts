import TinyEmitter from 'tiny-emitter';

interface IStyle {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    padding?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    borderWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    flexDirection?: 'column' | 'row';
    flexShrink?: number;
    flexGrow?: number;
    flexWrap?: 'wrap' | 'nowrap';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    position?: 'relative' | 'absolute';
    fontSize?: number;
    lineHeight?: number | 'string';
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    color?: string;
    backgroundColor?: string;
    textOverflow?: 'ellipsis' | 'clip';
    letterSpacing?: number;
    borderRadius?: number;
    borderColor?: string;
    borderTopColor?: string;
    backgroundImage?: string;
    borderBottomColor?: string;
    borderLeftColor?: string;
    borderRightColor?: string;
    opacity?: number;
    fontWeight?: string;
    fontFamily?: string;
}

declare class Rect {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    constructor(left?: number, top?: number, width?: number, height?: number);
    set(left?: number, top?: number, width?: number, height?: number): void;
    /**
     * 判断两个矩形是否相交
     * 原理可见: https://zhuanlan.zhihu.com/p/29704064
     */
    intersects(rect: Rect): boolean;
}

interface ILayoutBox {
    left: number;
    top: number;
    width: number;
    height: number;
    absoluteX: number;
    absoluteY: number;
    originalAbsoluteX: number;
    originalAbsoluteY: number;
}
type Callback$2 = (...args: any[]) => void;
declare class Element {
    children: Element[];
    parent: Element | null;
    parentId: number;
    id: number;
    idName: string;
    className: string;
    root: Element | null;
    EE: any;
    isDestroyed: boolean;
    dataset: Record<string, string>;
    style: IStyle;
    rect: Rect | null;
    classNameList: string[] | null;
    layoutBox: ILayoutBox;
    backgroundImage: any;
    ctx: CanvasRenderingContext2D | null;
    isDirty: boolean;
    shouldUpdate: boolean;
    type?: string;
    tagName?: string;
    private originStyle;
    constructor({ style, idName, className, id, dataset, }: {
        style?: IStyle;
        idName?: string;
        className?: string;
        id?: number;
        dataset?: Record<string, string>;
    });
    backgroundImageSetHandler(backgroundImage: string): void;
    /**
     * 监听属性的变化判断是否需要执行 reflow、repaint 操作
     * 经过测试，Object.defineProperty 是一个比较慢的方法， 特别是属性比较多的时候
     * 因此会先判断是否支持 Proxy，iMac (Retina 5K, 27-inch, 2017)测试结果
     * 总共 312 个节点，observeStyleAndEvent总耗时为：
     * Proxy: 3ms
     * Object.defineProperty: 20ms
     */
    observeStyleAndEvent(): void;
    repaint(): void;
    render(): void;
    /**
     * 参照 Web 规范：https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     */
    getBoundingClientRect(): Rect;
    getElementById(id: string): Element | null;
    getElementsById(id: string): (Element | null)[];
    getElementsByClassName(className: string): (Element | null)[];
    insert(ctx: CanvasRenderingContext2D, needRender: boolean): void;
    unBindEvent(): void;
    setDirty(): void;
    remove(): void;
    destroySelf(): void;
    destroy(): void;
    add(element: Element): void;
    appendChild(element: Element): void;
    removeChild(element: Element): void;
    emit(event: string, ...theArgs: any[]): void;
    on(event: string, callback: Callback$2): void;
    once(event: string, callback: Callback$2): void;
    off(event: string, callback?: Callback$2): void;
    renderBorder(ctx: CanvasRenderingContext2D): {
        needClip: boolean;
        needStroke: boolean;
    };
}

declare enum STATE {
    UNINIT = "UNINIT",
    INITED = "INITED",
    RENDERED = "RENDERED",
    CLEAR = "CLEAR"
}

interface CharData {
    x: number;
    y: number;
    w: number;
    h: number;
    offX: number;
    offY: number;
    xadvance: number;
    kerning: {
        [key: string]: number;
    };
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
declare class BitMapFont {
    private config;
    event: any;
    chars: Chars;
    ready: boolean;
    texture: HTMLImageElement | null;
    lineHeight?: number;
    fontSize?: number;
    constructor(name: string, src: string, config: string);
    parseConfig(fntText: string): Chars;
    getConfigByLineName(linesParsed: string[][], lineName?: string): ConfigLineData;
    getConfigByKeyInOneLine(configText: string[] | string, key: string): number;
}

type Callback$1 = (...args: any[]) => void;
declare class Ticker {
    private count;
    private started;
    private animationId;
    private cbs;
    private nextCbs;
    private innerCbs;
    private update;
    cancelIfNeed(): void;
    add(cb: Callback$1, isInner?: boolean): void;
    next(cb: Callback$1): void;
    remove(cb?: Callback$1, isInner?: boolean): void;
    start(): void;
    stop(): void;
}

interface IViewOptions {
    style?: IStyle;
    idName?: string;
    className?: string;
    dataset?: Record<string, string>;
}
declare class View extends Element {
    constructor({ style, idName, className, dataset, }: IViewOptions);
    destroySelf(): void;
    checkNeedRender(): boolean;
    render(): void;
    repaint(): void;
}

interface IImageOptions {
    style?: IStyle;
    idName?: string;
    className?: string;
    src?: string;
    dataset?: Record<string, string>;
}
declare class Image extends Element {
    private imgsrc;
    type: string;
    img: HTMLImageElement | null;
    constructor(opts: IImageOptions);
    get src(): string;
    set src(newValue: string);
    repaint(): void;
    destroySelf(): void;
    render(): void;
}

interface ITextProps {
    style?: IStyle;
    idName?: string;
    className?: string;
    value?: string;
    dataset?: Record<string, string>;
}
declare class Text extends Element {
    private valuesrc;
    private originStyleWidth;
    fontSize?: number;
    textBaseline: CanvasTextBaseline;
    font: string;
    textAlign: CanvasTextAlign;
    fillStyle: string;
    constructor({ style, idName, className, value, dataset, }: ITextProps);
    get value(): string;
    set value(newValue: string);
    toCanvasData(): void;
    repaint(): void;
    destroySelf(): void;
    insert(ctx: CanvasRenderingContext2D, needRender: boolean): void;
    render(): void;
}

interface IScrollViewOptions {
    style?: IStyle;
    idName?: string;
    className?: string;
    scrollX?: boolean | undefined;
    scrollY?: boolean | undefined;
    dataset?: Record<string, string>;
}
interface IInnerScrollerOption {
    scrollingX?: boolean;
    scrollingY?: boolean;
}
declare class ScrollView extends View {
    scrollTop: number;
    scrollLeft: number;
    hasEventBind: boolean;
    currentEvent: null;
    type: string;
    private scrollYProp;
    private innerScrollerOption;
    private scrollerObj?;
    private isFirstScroll?;
    constructor({ style, idName, className, scrollX, scrollY, dataset, }: IScrollViewOptions);
    /**
     * 获取滚动列表内所有元素的高度和
     * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
     */
    get scrollHeight(): number;
    get scrollWidth(): number;
    get scrollX(): boolean | undefined;
    set scrollX(value: boolean | undefined);
    get scrollY(): boolean | undefined;
    set scrollY(value: boolean | undefined);
    get scrollerOption(): IInnerScrollerOption;
    set scrollerOption(value: IInnerScrollerOption);
    repaint(): void;
    destroySelf(): void;
    renderTreeWithTop(tree: Element): void;
    clear(): void;
    scrollRender(): void;
    scrollHandler(left: number, top: number): void;
    insert(context: CanvasRenderingContext2D): void;
    scrollTo(left?: number, top?: number, animate?: boolean): void;
}

interface IBitMapTextOptions {
    style?: IStyle;
    idName?: string;
    className?: string;
    value?: string;
    font?: string;
    dataset?: Record<string, string>;
}
declare class BitMapText extends Element {
    ctx: CanvasRenderingContext2D | null;
    type: string;
    private valuesrc;
    font: BitMapFont;
    constructor(opts: IBitMapTextOptions);
    get value(): string;
    set value(newValue: string);
    repaint(): void;
    destroySelf(): void;
    render(): void;
    getTextBounds(): {
        width: number;
        height: number | undefined;
    };
    renderText(ctx: CanvasRenderingContext2D): void;
}

interface ICanvasOptions {
    style?: IStyle;
    idName?: string;
    className?: string;
    dataset?: Record<string, string>;
    width?: number;
    height?: number;
    autoCreateCanvas?: boolean;
}
declare class Canvas extends Element {
    private canvasInstance;
    constructor(opts: ICanvasOptions);
    get canvas(): HTMLCanvasElement | null;
    set canvas(cvs: HTMLCanvasElement | null);
    update(): void;
    repaint(): void;
    destroySelf(): void;
    render(): void;
}

interface Constructor {
    new (...args: any[]): any;
}
declare function registerComponent(name: string, Constructor: Constructor): void;

declare const EE: TinyEmitter;
interface IViewPort {
    width: number;
    height: number;
}
interface IViewPortBox {
    width: number;
    height: number;
    x: number;
    y: number;
}
declare class Layout extends Element {
    version: string;
    hasEventHandler: boolean;
    renderContext: CanvasRenderingContext2D | null;
    renderport: IViewPort;
    viewport: IViewPortBox;
    viewportScale: number;
    hasViewPortSet: boolean;
    realLayoutBox: {
        realX: number;
        realY: number;
    };
    bitMapFonts: BitMapFont[];
    eleCount: number;
    state: STATE;
    isNeedRepaint: boolean;
    ticker: Ticker;
    tickerFunc: () => void;
    private eventHandlerData;
    constructor({ style, }: {
        style?: IStyle;
        name?: string;
    });
    get debugInfo(): string;
    /**
     * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
     * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
     * 的绝对尺寸和位置信息更新到本渲染引擎。
     * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
     * y坐标
     */
    updateViewPort(box: IViewPortBox): void;
    init(template: string, style: Record<string, IStyle>, attrValueProcessor: Callback): void;
    reflow(isFirst?: boolean): void;
    /**
     * init阶段核心仅仅是根据xml和css创建了节点树
     * 要实现真正的渲染，需要调用 layout 函数，之所以将 layout 单独抽象为一个函数，是因为 layout 应当是可以重复调用的
     * 比如改变了一个元素的尺寸，实际上节点树是没变的，仅仅是需要重新计算布局，然后渲染
     * 一个完整的 layout 分成下面的几步：
     * 1. 执行画布清理，因为布局变化页面需要重绘，这里没有做很高级的剔除等操作，一律清除重画，实际上性能已经很好
     * 2. 节点树都含有 style 属性，css-layout 能够根据这些信息计算出最终布局，详情可见 https://www.npmjs.com/package/css-layout
     * 3. 经过 Layout 计算，节点树带上了 layout、lastLayout、shouldUpdate 布局信息，但这些信息并不是能够直接用的
     *    比如 layout.top 是指在一个父容器内的 top，最终要实现渲染，实际上要递归加上复容器的 top
     *    这样每次 repaint 的时候只需要直接使用计算好的值即可，不需要每次都递归计算
     *    这一步称为 layoutChildren，目的在于将 css-layout 进一步处理为可以渲染直接用的布局信息
     * 4. renderChildren：执行渲染
     * 5. bindEvents：执行事件绑定
     */
    layout(context: CanvasRenderingContext2D): void;
    repaint(): void;
    getElementViewportRect(element: Element): Rect;
    getChildByPos(tree: Layout | Element, x: number, y: number, itemList: (Layout | Element)[]): void;
    eventHandler: (eventName: string) => (e: MouseEvent | GameTouchEvent) => void;
    bindEvents(): void;
    unBindEvents(): void;
    emit(event: string, data: any): void;
    on(event: string, callback: Callback): void;
    once(event: string, callback: Callback): void;
    off(event: string, callback: Callback): void;
    destroyAll(tree: Layout | Element): void;
    clear(options?: {
        removeTicker?: boolean;
    }): void;
    clearPool(): void;
    clearAll(): void;
    loadImgs(arr?: never[]): Promise<(HTMLImageElement | null)[]>;
    registBitMapFont(name: string, src: string, config: string): void;
    cloneNode(element: Element, deep?: boolean): any;
    Element: typeof Element;
    View: typeof View;
    Text: typeof Text;
    Image: typeof Image;
    ScrollView: typeof ScrollView;
    BitMapText: typeof BitMapText;
    Canvas: typeof Canvas;
    registerComponent: typeof registerComponent;
}
declare const _default: Layout;

export { EE, _default as default };
