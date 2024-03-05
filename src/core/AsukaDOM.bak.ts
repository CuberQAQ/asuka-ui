// import { AsukaLayoutNode } from "./asuka-layout";
// import { defineStyleReflection } from "./layout-bridge";
// import { splice, findWhere, createAttributeFilter, isElement } from "./util";

import { assert } from '../debug/index';
import { objectTag } from '../decorator/debug';
import { Constraints } from './AsukaLayout';
import { NodeType, isRenderNode } from './constants';
import { splice } from './utils';
import * as hmUI from '@zos/ui';

/**
 * **节点类**
 */
export abstract class AsukaNode {
  /** 父节点 */
  public parentNode: AsukaNode | null = null;

  /**
   * **获取子节点的下一个下一个兄弟节点**
   * @description
   * 不可构成循环链表
   * @override 拥有子节点的考虑重载本方法
   * @param child 子节点
   * @returns 下一个兄弟节点
   */
  abstract getChildNextSibling(child: AsukaNode): AsukaNode | null;

  get nextSibling(): AsukaNode | null {
    if (this.parentNode === null) return null;
    return this.parentNode.getChildNextSibling(this);
  }
  // /** 直接前继节点 */
  // public previousSibling: AsukaNode | null = null;
  // /** 直接后继节点 */
  // public nextSibling: AsukaNode | null = null;

  constructor(
    /** 节点类型 */
    public nodeType: number,
    /** 节点名称 */
    public nodeName: string,
  ) {}

  /**------------------DEBUG------------------- */
}

/**
 * **文字节点类**
 */
export class AsukaTextNode extends AsukaNode {
  private _text: string;
  constructor(text: string) {
    super(NodeType.TEXT_NODE, '#text'); // 3: TEXT_NODE
    this._text = text;
  }
  /**
   * 该文字节点保存的字符串
   */
  set data(text: string) {
    this._text = text;
  }
  get data() {
    return this._text;
  }

  getChildNextSibling(child: AsukaNode): AsukaNode | null {
    return null;
  }

  /**------------------DEBUG------------------- */
}

/**
 * **可渲染节点**
 * @description
 * 涉及布局、绘制、事件都是可渲染节点
 */
export abstract class RenderNode extends AsukaNode {
  protected _handlers: { [key: string]: Function[] } = {};
  // protected _attributes: {};
  constructor(nodeTyle: number | null, nodeName: string) {
    super(nodeTyle || NodeType.RENDER_NODE, nodeName); // 1: ELEMENT_NODE
  }

  /**------------------属性设置------------------- */

  /**
   * **设置元素属性**
   * @param key 属性键
   * @param value 属性值
   */
  setProperty(key: string, value: any) {}

  /**------------------事件处理------------------- */

  /**
   * **添加事件处理器**
   * @param type 事件类型，不区分大小写
   * @param handler 事件处理函数
   */
  addEventListener(type: string, handler: (event: AsukaEvent) => void) {
    (this._handlers[type] || (this._handlers[type] = [])).push(handler);
  }
  /**
   * **删除事件处理器**
   * @param type 事件类型，不区分大小写
   * @param handler 事件处理函数
   */
  removeEventListener(type: string, handler: (event: AsukaEvent) => void) {
    splice(this._handlers[type], handler, undefined, true);
  }
  /**
   * **触发事件**
   * @description 如果要添加默认操作，请在调用本方法后判断`event.defaultPrevented`并决定是否执行默认操作
   * @param event 事件对象
   * @returns
   */
  dispatchEvent(event: AsukaEvent) {
    let target: RenderNode = event.target || (event.target = this),
      cancelable = event.cancelable,
      handlers,
      i;
    do {
      event.currentTarget = target;
      handlers = target._handlers && target._handlers[event.type];
      if (handlers)
        // 从后往前遍历事件处理函数
        for (i = handlers.length; i--; ) {
          handlers[i].call(target, event);
          if (cancelable && event._end) break;
        }
    } while (
      event.bubbles &&
      !(cancelable && event._stop) &&
      (target = target.parentNode as RenderNode)
    );
    return handlers != null;
  }

  /**------------------挂载操作------------------- */

  /**
   *  **当元素被挂载到Element树上**
   * @description
   * 即当被作为appendChild insertBefore作为参数成为子节点时调用
   * 即当被作为removeChild作为参数成为子节点时调用。调用时parentNode已为新父元素。
   */
  abstract onMount(): void;
  /**
   *  **当元素被从Element树上取消挂载**
   * @description
   * 即当被作为removeChild作为参数成为子节点时调用。调用时parentNode已为null。
   */
  abstract onUnmount(): void;
  /**
   * **当元素所在树由孤立变为可渲染(即渲染树不与AsukaPage连接)**
   * @description
   * 子类应当按照自己的子模型重载本方法，**并在重载方法中调用`super.attach()`**
   */
  attach(): void {
    assert(!this._attached);
    this._attached = true;
    // 如果该节点在孤立状态时被上了布局脏标记
    if (this._needLayout && this._relayoutBoundary === null) {
      this._needLayout = false;
      this.markNeedLayout();
    }
    // TODO 绘制操作
  }
  /**
   * **当元素所在树由可渲染变为孤立(即渲染树与AsukaPage连接)**
   * @description
   * 子类应当按照自己的子模型重载本方法，**并在重载方法中调用`super.detach()`**
   */
  detach(): void {
    assert(this._attached);
    this._attached = false;
    // assert(parent === null || this._attached === (this.parentNode as RenderNode)._attached)
  }

  /**------------------子节点操作------------------- */

  /** 子节点中位于首项的节点 */
  abstract get firstChild(): AsukaNode | null;

  /** **遍历子渲染节点** */
  abstract visitChildren(handler: (child: RenderNode) => void): void;

  /**
   * **设置挂载的子节点**
   * @description
   * 用于挂载节点时设置子节点的插槽属性(parentNode之类)、重绘节点等。不负责detached的更新！
   * @param child 要设置的子节点
   */
  protected _setupMountingChild(child: AsukaNode) {
    child.parentNode = this;
    if (isRenderNode(child)) {
      // (child as RenderNode)._owner = this._owner;
      (child as RenderNode).onMount();
      (child as RenderNode)._cleanRelayoutBoundary();
    }
    this.markNeedLayout();
  }

  /**
   * **设置取消挂载的子节点**
   * @description
   * 用于取消挂载节点时设置子节点的插槽属性(parentNode之类)、重绘节点。不负责detached的更新！
   * @param child 要设置的子节点
   */
  protected _setupUnmountingChild(child: AsukaNode) {
    child.parentNode = null;
    if (isRenderNode(child)) {
      // (child as RenderNode)._owner = null;
      (child as RenderNode).onUnmount();
      (child as RenderNode).parentData = null
    }
    // TODO setupParentData
    this.markNeedLayout();
  }

  /**
   * **移除指定的子节点**
   * @param child 要删除的子节点
   * @returns 该子节点本身
   * @abstract **子类实现该方法时需要调用`this._setupUnmountingChild()`方法**来设置子节点(比如parentNode等属性)
   */
  abstract unmountChild(child: AsukaNode): AsukaNode;
  // {
  //   if (splice(this.childNodes, child) !== -1) {
  //     this._setupMountingChild(child);
  //   }
  //   return child;
  // }

  /**
   * **添加一个子节点**
   * @description
   * 插入一个子节点 或 追加一个子节点到子节点列表末端。
   * 指定`ref`时为插入操作，否则为追加操作。
   * @param child 要插入或添加的子节点
   * @param ref 要插入的子节点后面的子节点
   * @returns 该子节点本身
   * @abstract **实现该抽象方法时需调用`this._setupChild()`** 来设置子节点(比如parentNode等属性)
   */
  abstract mountChild(child: AsukaNode, ref?: AsukaNode): AsukaNode;
  // {
  //   if (ref) splice(this.childNodes, ref, child);
  //   else this.childNodes.push(child);
  //   this._setupChild(child)
  //   return child;
  // }

  /**------------------布局相关------------------- */

  /** 需要布局(布局脏标记) */
  _needLayout: boolean = false;
  /** 需要绘制(绘制脏标记) */
  _needPaint: boolean = false;
  /** 局部重布局的起始节点 */
  _relayoutBoundary: RenderNode | null = null;
  /** 当前的布局约束 */
  _constraints: Constraints | null = null;
  // /** 控件工厂 */
  // _widgetFactory: WidgetFactory | null = null;
  /** 子节点是否被挂载在可渲染的树上（即根节点是否连接了AsukaPage） */
  _attached: boolean = false;
  /** 所属页面(目前由AsukaPage创建节点时设置) */
  _core: AsukaPage | null = null;
  /** 该节点的Size是否只与父节点传递的Constrains有关，而不与其它任何因素（如子节点的布局）有关。 */
  sizedByParent: boolean = false;

  parentData: any;

  /**
   * **有条件地更新子树重布局边界**
   * @description
   * 当节点的_relayoutBoundary不是自己，且父节点的_relayoutBoundary与自己的不相等时，更新并传递给子节点
   */
  protected _propagateRelayoutBoundary(): void {
    // _relayoutBoundary 只有两种情况: this 或者 与父节点的原_relayoutBoundary一致，如果是后者，就更新
    if (this._relayoutBoundary === this) return;
    const parentRelayoutBoundary: RenderNode | null = (
      this.parentNode! as RenderNode
    )._relayoutBoundary;
    if (parentRelayoutBoundary !== this._relayoutBoundary) {
      this._relayoutBoundary = parentRelayoutBoundary;
      this.visitChildren((child) => {
        child._propagateRelayoutBoundary();
      });
    }
  }

  /**
   * **有条件地清空子树重布局边界**
   * @description
   * 若节点的_relayoutBoundary不是自己，则设为null
   */
  protected _cleanRelayoutBoundary(): void {
    if (this._relayoutBoundary !== this) {
      this._relayoutBoundary = null;
      this.visitChildren((child) => child._cleanRelayoutBoundary());
    }
  }

  /**
   * **布局算法**
   * @param constraints 布局约束，要求该RenderNode的尺寸应符合该约束
   * @param parentUsesSize 父节点在 layout 时会不会使用当前节点的 size 信息(也就是当前节点的排版信息对父节点有无影响)；
   */
  layout(
    constraints: Constraints,
    { parentUsesSize = false }: { parentUsesSize: boolean },
  ): void {
    // 本节点是否为重布局边界（即布局脏标记是否会传递给本节点的父节点，并触发父节点重新布局）
    let isRelayoutBoundary =
      !parentUsesSize || // 父节点不使用该节点的Size，也就是该节点的Size是固定的(到下次布局前)，所以该节点子树的布局变化不需要父节点重新布局
      this.sizedByParent || // 该节点的Size只与父节点的Size有关，也就是该节点的子树布局变化不会影响该节点的Size，故不需要父节点重新布局
      constraints.isTight || // 父节点传递了严格布局约束，也就是该节点的Size是固定的(到下次布局前)，那么该节点的子树布局变化不会使该节点的Size变化，故不需要父节点重新布局
      isRenderNode(this.parentNode); // 父节点不是可渲染节点，子树的布局操作必须由该节点触发

    // 本次布局的重布局边界
    let relayoutBoundary: RenderNode = isRelayoutBoundary
      ? this
      : (this.parentNode! as RenderNode)._relayoutBoundary!; // 本节点的_relayoutBoundary由父节点在layout中设置

    // 如果该节点没有布局脏标记 且 上次布局的约束对象与本次的相等 （也就是本节点的子树无需重布局）
    if (!this._needLayout && constraints.equals(this._constraints)) {
      // 更新子树的`relayoutBoundary`并立刻返回（剪枝优化）
      if (relayoutBoundary !== this._relayoutBoundary) {
        this._relayoutBoundary = relayoutBoundary;
        this.visitChildren((child) => child._propagateRelayoutBoundary());
      }
      return;
    }
    this._constraints = constraints;

    // 若原来的`_relayoutBoundary`不为空（也就是已经布局过了，子渲染组件的也一定不为空），且RelayoutBoundary要变了
    if (
      this._relayoutBoundary !== null &&
      relayoutBoundary !== this._relayoutBoundary
    ) {
      // The local relayout boundary has changed, must notify children in case
      // they also need updating. Otherwise, they will be confused about what
      // their actual relayout boundary is later.
      this.visitChildren((child) => child._cleanRelayoutBoundary());
    }
    this._relayoutBoundary = relayoutBoundary;

    if (this.sizedByParent) {
      this.performResize();
    }
    this.performLayout();
    // markNeedsSemanticsUpdate
    this._needLayout = false;

    this.markNeedsPaint();
  }
  /**
   * **将该RenderNode标记为需要重新布局**
   */
  markNeedLayout(): void {
    if (this._needLayout) return;
    // 从未布局或者被取消挂载的时候自己的重布局边界不是自己
    if (this._relayoutBoundary === null) {
      this._needLayout = true;
      // TODO 自加测试
      assert(this.parentNode !== null);
      // _relayoutBoundary is cleaned by an ancestor in RenderObject.layout.
      // Conservatively mark everything dirty until it reaches the closest
      // known relayout boundary.
      if (this.parentNode !== null) this.markParentNeedsLayout();
      return;
    }
    if (this._relayoutBoundary !== this) {
      this.markParentNeedsLayout();
    } else {
      this._needLayout = true;
      if (this._attached) {
        this._core?.addRelayoutNode(this);
        this._core!.requestRelayout();
      }
    }
  }
  /**
   * **将父节点标记为需要重新布局**
   */
  markParentNeedsLayout(): void {
    assert(this.parentNode !== null);
    this._needLayout = true;
    (this.parentNode! as RenderNode).markNeedLayout();
  }
  /**
   * **标记该节点需要重新绘制(调用onCommit并传递布局结果)**
   */
  markNeedsPaint(): void {
    if(this._needPaint) return;
    this._needPaint = true;
    
  }
  /**
   * **重新确定尺寸（仅当sizedByParent为true时有效）,应当只与父组件传递的布局约束相关。**
   */
  abstract performResize(): void;
  /**
   * **重新布局**
   */
  abstract performLayout(): void;

  /**------------------DEBUG------------------- */
}

/**
 * **事件类**
 * @description
 */
export class AsukaEvent {
  public bubbles: boolean;
  /** 触发事件的元素, 默认为调用`depatchEvent()`的元素 */
  public target?: RenderNode;
  /** 正在响应该事件的元素 */
  public currentTarget?: RenderNode;
  /** 该事件是否可取消 */
  public cancelable: boolean;
  /** 该事件是否已被取消继续冒泡传播(当`cancelable`为`true`时有效) */
  public _stop: boolean = false;
  /** 该事件是否已被立即取消继续传播(当`cancelable`为`true`时有效) */
  public _end: boolean = false;
  /** 一个布尔值，表示 `preventDefault()` 方法是否取消了事件的默认行为。 */
  public defaultPrevented: boolean = false; // TODO is false should be the default value?
  /**
   * **创建事件对象**
   * @param type 事件类型，不区分大小写
   * @param opts 事件属性
   * @property `opts.bubbles` 是否为冒泡类型
   * @property `opts.cancelable` 是否为可以取消
   */
  constructor(
    public type: string,
    opts: {
      bubbles: boolean; // 是否为冒泡类型
      cancelable: boolean; // 是否可取消
    },
  ) {
    this.type = type;
    this.bubbles = !!(opts && opts.bubbles);
    this.cancelable = !!(opts && opts.cancelable);
  }
  /**
   * **阻止冒泡事件向上传播**
   * @description
   * 它不能阻止附加到相同元素的相同事件类型的其他事件处理器。如果要阻止这些处理器的运行，请参见 `stopImmediatePropagation()` 方法。
   * （当`cancelable`为`true`时有效）
   */
  stopPropagation() {
    this._stop = true;
  }
  /**
   * **立即阻止事件传播**
   * @description
   * 如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。
   * 如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。
   * 如果想只取消冒泡传播而继续执行相同元素剩下的事件监听器，请参见`stopPropagation()`方法。
   * （当`cancelable`为`true`时有效）
   */
  stopImmediatePropagation() {
    this._end = this._stop = true;
  }
  /** 阻止事件的默认行为 */
  preventDefault() {
    this.defaultPrevented = true;
  }
}

export abstract class RenderNative extends RenderNode {
  // TODO layout type
  /**
   * **创建组件或更新布局**
   * @description
   * 当布局更新或者初始化时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
   * @param layout 布局信息
   * @param initial 是否为初始化
   * @param widgetFactory 控件工厂（仅应在onCommit调用开始到onDestory调用期间使用，因为其他时候可能发生改变）
   */
  abstract onCommit(
    layout: any,
    initial?: boolean,
    widgetFactory?: WidgetFactory,
  ): void;
  /**
   * **删除组件**
   * @description
   * 当控件被移出可渲染树时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
   */
  abstract onDestroy(): void;

  onMount(): void {}
  onUnmount(): void {}
}

/**
 * **视图**
 * @description
 * Element树的根节点。获取一个hmUI控件工厂，并将其传递给子树。
 * 外界访问
 */
class RenderView extends RenderNode {
  constructor() {
    super(NodeType.RENDER_NODE, '#frame');
  }

  protected _rootNode: RenderNode | null = null;
  /**
   * **设置`rootNode`，并调用detach和attach**
   */
  // set rootNode(node: RenderNode | null) {
  //   if(this._rootNode === node) return;
  //   this._rootNode?.detach();
  //   this._rootNode = node
  //   this._rootNode?.attach();
  // }
  // get rootNode() {
  //   return this._rootNode;
  // }

  onMount(): void {}
  onUnmount(): void {}

  /**
   * // TODO
   * 删除该View及整棵子树
   */
  destroy(): void {}

  getChildNextSibling(child: AsukaNode): AsukaNode | null {
    return null;
  }
  get firstChild(): AsukaNode | null {
    return this._rootNode;
  }
  unmountChild(child: AsukaNode): AsukaNode {
    if (child === this._rootNode) {
      this._setupUnmountingChild(child);
      this._rootNode?.detach();
      this._rootNode = null; // 同时detach子树
    }
    return child;
  }
  mountChild(child: AsukaNode, ref?: AsukaNode | undefined): AsukaNode {
    assert(this._rootNode === null);
    assert(ref === null);
    assert(isRenderNode(child));
    if (this._rootNode !== null) this._rootNode.detach();
    this._rootNode = child as RenderNode;
    this._rootNode.attach();
    return child;
  }
  performLayout(): void {}
  performResize(): void {}
  visitChildren(handler: (child: RenderNode) => void): void {
    assert(this._rootNode !== null);
    if (this._rootNode !== null) handler(this._rootNode!);
  }
}

export interface WidgetFactory {
  createWidget(widgetType: number, option: Record<string, any>): any;
  deleteWidget(widget: any): void;
}

export class AsukaPage {
  public frameList: RenderView[] = [];
  protected _activeFrame: RenderView | null = null;
  get activeFrame() {
    return this._activeFrame;
  }
  set activeFrame(frame) {
    // TODO
    this._activeFrame = frame;
  }
  createFrame(mount: WidgetFactory = hmUI): RenderView {
    let frame = new RenderView();
    return frame;
  }
  deleteFrame(frame: RenderView) {}

  createElement(type: string) {
    let element: RenderNode | null = null;
    switch (type) {
    }
    if (element !== null) {
      (element as RenderNode)._core = this;
    }
  }

  /** 需要重新布局的起始节点 */
  _nodesNeedingLayout: RenderNode[] = [];
  /** 异步管理器句柄(可能是setTimeout或者Promise之类的) */
  _asyncHandler: number | null = null;
  /**
   * **添加需要重新布局的节点**
   */
  addRelayoutNode(node: RenderNode) {
    this._nodesNeedingLayout.push(node);
  }
  /**
   * **请求重新布局**
   */
  requestRelayout() {
    if (this._asyncHandler === null) {
      this._asyncHandler = setTimeout(() => this._relayout());
    }
  }
  /**
   * **取消重新布局**
   */
  cancelRelayout() {
    if (this._asyncHandler !== null) clearTimeout(this._asyncHandler);
  }
  /**
   * 重新布局时调用的
   */
  _relayout() {
    // TODO
    this._asyncHandler = null;
  }
}
