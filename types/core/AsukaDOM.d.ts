/**
 * **节点类**
 */
export declare class AsukaNode {
    /** 节点类型 */
    nodeType: number;
    /** 节点名称 */
    nodeName: string;
    /** 父节点 */
    parentNode?: AsukaNode;
    /** 直接前继节点 */
    previousSibling?: AsukaNode;
    /** 直接后继节点 */
    nextSibling?: AsukaNode;
    constructor(
    /** 节点类型 */
    nodeType: number, 
    /** 节点名称 */
    nodeName: string);
}
/**
 * **文字节点类**
 */
export declare class AsukaTextNode extends AsukaNode {
    private _text;
    constructor(text: string);
    /**
     * 该文字节点保存的字符串
     */
    set data(text: string);
    get data(): string;
}
/**
 * **元素类**
 */
export declare abstract class AsukaElement extends AsukaNode {
    protected _handlers: {
        [key: string]: Function[];
    };
    constructor(nodeTyle: number | null, nodeName: string);
    /**------------------属性设置------------------- */
    /**
     * **设置元素属性**
     * @param key 属性键
     * @param value 属性值
     */
    setProperty(key: string, value: any): void;
    /**------------------事件处理------------------- */
    /**
     * **添加事件处理器**
     * @param type 事件类型，不区分大小写
     * @param handler 事件处理函数
     */
    addEventListener(type: string, handler: (event: AsukaEvent) => void): void;
    /**
     * **删除事件处理器**
     * @param type 事件类型，不区分大小写
     * @param handler 事件处理函数
     */
    removeEventListener(type: string, handler: (event: AsukaEvent) => void): void;
    /**
     * **触发事件**
     * @description 如果要添加默认操作，请在调用本方法后判断`event.defaultPrevented`并决定是否执行默认操作
     * @param event 事件对象
     * @returns
     */
    dispatchEvent(event: AsukaEvent): boolean;
    /**------------------子节点操作------------------- */
    /** 子节点列表 */
    childNodes: AsukaNode[];
    /** 子节点中位于首项的节点 */
    get firstChild(): AsukaNode;
    /** 子节点中位于末项的节点 */
    get lastChild(): AsukaNode;
    /** **返回所有元素类型子节点** */
    getChildrenElement(): AsukaNode[];
    /**
     * **添加一个子节点到子节点列表的末端**
     * @param child 要添加的子节点
     * @returns 该子节点本身
     */
    appendChild(child: AsukaNode): AsukaNode;
    /**
     * **插入一个子节点 或 追加一个子节点到子节点列表末端**
     * @description
     * 指定`ref`时为插入操作，否则为追加操作
     * @param child 要插入或添加的子节点
     * @param ref 要插入的子节点后面的子节点
     * @returns 该子节点本身
     */
    insertBefore(child: AsukaNode, ref?: AsukaNode): AsukaNode;
    /**
     * **删除一个子节点**
     * @param child 要删除的子节点
     * @returns 该子节点本身
     */
    removeChild(child: AsukaNode): AsukaNode;
}
/**
 * **事件类**
 * @description
 */
export declare class AsukaEvent {
    type: string;
    bubbles: boolean;
    /** 触发事件的元素, 默认为调用`depatchEvent()`的元素 */
    target?: AsukaElement;
    /** 正在响应该事件的元素 */
    currentTarget?: AsukaElement;
    /** 该事件是否可取消 */
    cancelable: boolean;
    /** 该事件是否已被取消继续冒泡传播(当`cancelable`为`true`时有效) */
    _stop: boolean;
    /** 该事件是否已被立即取消继续传播(当`cancelable`为`true`时有效) */
    _end: boolean;
    /** 一个布尔值，表示 `preventDefault()` 方法是否取消了事件的默认行为。 */
    defaultPrevented: boolean;
    /**
     * **创建事件对象**
     * @param type 事件类型，不区分大小写
     * @param opts 事件属性
     * @property `opts.bubbles` 是否为冒泡类型
     * @property `opts.cancelable` 是否为可以取消
     */
    constructor(type: string, opts: {
        bubbles: boolean;
        cancelable: boolean;
    });
    /**
     * **阻止冒泡事件向上传播**
     * @description
     * 它不能阻止附加到相同元素的相同事件类型的其他事件处理器。如果要阻止这些处理器的运行，请参见 `stopImmediatePropagation()` 方法。
     * （当`cancelable`为`true`时有效）
     */
    stopPropagation(): void;
    /**
     * **立即阻止事件传播**
     * @description
     * 如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。
     * 如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。
     * 如果想只取消冒泡传播而继续执行相同元素剩下的事件监听器，请参见`stopPropagation()`方法。
     * （当`cancelable`为`true`时有效）
     */
    stopImmediatePropagation(): void;
    /** 阻止事件的默认行为 */
    preventDefault(): void;
}
declare class AsukaFrame extends AsukaElement {
    constructor();
}
export declare abstract class AsukaWidget extends AsukaElement {
    /**
     * **创建组件或更新布局**
     * @description
     * 当布局更新或者初始化时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
     * @param layout 布局信息
     * @param initial 是否为初始化
     * @param widgetFactory 控件工厂（仅应在onCommit调用开始到onDestory调用期间使用，因为其他时候可能发生改变）
     */
    abstract onCommit(layout: any, initial?: boolean, widgetFactory?: WidgetFactory): void;
    /**
     * **删除组件**
     * @description
     * 当控件被移出可渲染树时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
     */
    abstract onDestroy(): void;
}
export interface WidgetFactory {
    createWidget(widgetType: number, option: Record<string, any>): any;
    deleteWidget(widget: any): void;
}
export declare class AsukaPage {
    frameList: AsukaFrame[];
    protected _activeFrame: AsukaFrame | null;
    get activeFrame(): AsukaFrame | null;
    set activeFrame(frame: AsukaFrame | null);
    createFrame(mount?: WidgetFactory): AsukaFrame;
    deleteFrame(frame: AsukaFrame): void;
}
export {};
//# sourceMappingURL=AsukaDOM.d.ts.map