// import { AsukaLayoutNode } from "./asuka-layout";
// import { defineStyleReflection } from "./layout-bridge";
// import { splice, findWhere, createAttributeFilter, isElement } from "./util";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RenderView_key;
import { getDeviceInfo } from '@zos/device';
import { assert, reportError } from '../debug/index.js';
import { Constraints, Coordinate, Size } from './layout.js';
import { NodeType, isRenderNode } from './constants.js';
import { findWhere, splice } from './utils.js';
import * as hmUI from '@zos/ui';
/**
 * **节点类**
 */
export class AsukaNode {
    get nextSibling() {
        if (this.parentNode === null)
            return null;
        return this.parentNode.getChildNextSibling(this);
    }
    // /** 直接前继节点 */
    // public previousSibling: AsukaNode | null = null;
    // /** 直接后继节点 */
    // public nextSibling: AsukaNode | null = null;
    constructor(
    /** 节点类型 */
    nodeType, 
    /** 节点名称 */
    nodeName) {
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        /** 父节点 */
        this.parentNode = null;
    }
    /**------------------属性设置------------------- */
    /**
     * **设置元素属性**
     * @param key 属性键
     * @param value 属性值
     */
    setProperty(key, value) { }
    setProperties(props) {
        for (const key in props) {
            this.setProperty(key, props[key]);
        }
    }
}
/**
 * **文字节点类**
 */
export class AsukaTextNode extends AsukaNode {
    constructor(text) {
        super(NodeType.TEXT_NODE, '#text'); // 3: TEXT_NODE
        this._text = text;
    }
    /**
     * 该文字节点保存的字符串
     */
    set data(text) {
        this._text = text;
    }
    get data() {
        return this._text;
    }
    get firstChild() {
        return null;
    }
    getChildNextSibling(child) {
        return null;
    }
    mountChild(child, ref) {
        return false;
    }
    unmountChild(child) {
        return false;
    }
}
/**
 * **未知节点类**
 */
export class AsukaUnknownNode extends AsukaNode {
    constructor() {
        super(NodeType.UNKNOWN_NODE, '#unknown'); // 3: TEXT_NODE
    }
    get firstChild() {
        return null;
    }
    getChildNextSibling(child) {
        return null;
    }
    mountChild(child, ref) {
        return false;
    }
    unmountChild(child) {
        return false;
    }
}
/**
 * **可渲染节点**
 * @description
 * 涉及布局、绘制、事件都是可渲染节点
 */
export class RenderNode extends AsukaNode {
    // protected _attributes: {};
    constructor(nodeTyle, nodeName) {
        super(nodeTyle || NodeType.RENDER_NODE, nodeName); // 1: ELEMENT_NODE
        this._handlers = {};
        // {
        //   if (ref) splice(this.childNodes, ref, child);
        //   else this.childNodes.push(child);
        //   this._setupChild(child)
        //   return child;
        // }
        /**------------------布局相关------------------- */
        /**
         * **需要布局(布局脏标记)**
         *
         * 框架应保证执行布局操作时，所有非孤立且拥有布局脏标记的节点的`layout`都被调用，并将脏标记清除，并且应迅速(在下一个JS事件循环时)
         * 若为孤立且拥有脏标记的节点，在转为非孤立状态后应立即请求布局，并在下一个JS事件循环时调用其`layout`，并清除脏标记。
         *
         * 框架保证，拥有脏标记的节点在`layout`过程中，其`performLayout`被调用（如果`sizedByParent`为`true`，还保证其`performResize`被调用）。
         * 通常，所有可能使布局发生变化的操作，都应当做布局脏标记(调用`markNeedsLayout`)
         */
        this._needsLayout = false;
        /**
         * **需要确认最终位置(放置脏标记)**
         *
         * 框架应保证执行确认最终位置操作(简称放置操作)时，所有非孤立且拥有放置脏标记的节点的`place`都被调用，并将脏标记清除，并且应迅速(在下一个JS事件循环时)
         * 若为孤立且拥有脏标记的节点，在转为非孤立状态后应立即请求放置，并在下一个JS事件循环时调用其`place`，并清除脏标记。
         *
         * 框架保证，拥有脏标记的节点在`place`过程中，其`position`会得到更新，并根据情况执行`performCommit`操作.
         *
         * @see markNeedsPlace 更多有关`放置脏标记`的原理，请参见该方法
         */
        this._needsPlace = false;
        /**
         * **必须执行推送操作(强制更新标记)**
         *
         * 框架应保证所有非孤立且拥有强制更新标记的节点的`performCommit`和`onCommit`都被调用，并将该标记清除，并且应迅速(在下一个JS事件循环时，`place`过程中)
         * 若为孤立且拥有脏标记的节点，在转为非孤立状态后应立即请求放置，并在下一个JS事件循环时的`place`时执行推送操作，并清除脏标记。
         */
        this._mustCommit = false;
        /**
         * **本节点的深度**
         *
         * 定义`AsukaUI`的深度为`0`.
         *
         * 仅当`_attached`为`true`，即不为孤立节点时有效
         *
         * 主要用于在`AsukaUI`执行`layout`和`place`操作时确定先后顺序（深度小的节点先，深度大的节点后），保证不重复计算并正确.
         *
         * 在`attach`时更新
         */
        this._depth = 0;
        /**
         * **本节点尺寸**
         *
         * 请勿直接修改本属性，而是通过`size`(getter/setter)修改或访问
         */
        this._size = null;
        /**
         * **本节点尺寸是否已改变**
         *
         * 用途：
         * - 在`size`setter中判断并标记为`true`.
         * - 在`place`方法中用于判断是否需要执行`performCommit`操作，并将其标记为`false`
         */
        this._sizeChanged = false;
        /**
         * **相对父节点的坐标偏移**
         *
         * 请勿直接修改本属性，而是通过`offset`(getter/setter)修改或访问
         */
        this._offset = null;
        /**
         * **该节点在当前坐标系的位置**
         *
         * 请勿直接修改本属性，而是通过`position`(getter/setter)修改或访问
         */
        this._position = null;
        /**
         * **局部重布局边界**
         * @description
         * 当子树添加脏标记时，重布局边界节点不会调用`markParentNeedsLayout`将脏标记传递给父节点；
         * 而是阻止向上传递，（非孤立时）向框架中心请求布局，并将自身加入待布局列表。
         *
         * 无论是否孤立，若`_relayoutBoundary`不为`null`，就应保证该属性指向的节点与本节点连通。
         *
         * 局部重布局边界需要保证其子树的布局发生变化时(不考虑挂载等非布局操作)，不会影响其父节点的布局结果，即父节点不需要重新布局。
         *
         * 具体而言，满足以下四种条件其一的节点，可作为为局部重布局边界。
         * 1. `sizedByParent == true` 由于布局过程从子节点传递到父节点的信息仅有子节点尺寸，且该节点的尺寸仅由父节点提供的布局约束有关，
         * 因此，该节点的子树的布局发生变化时，父节点的布局结果不变，可作为为局部重布局边界。
         * 2. `parentUsesSize == false` 父节点布局过程不计算和使用子节点尺寸，也就是子节点子树发生的任何布局变化即使令该子节点的尺寸发生变化，
         * 也不影响父节点的布局结果。
         * 3. `constraints.isTight` 父节点传递的布局约束为严格约束（最大和最小宽度相等且最大和最小高度相等，符合该约束的尺寸仅有一种），
         * 4. `!isRenderNode(this.parentNode)` 父节点不是可渲染节点，故布局只能从本节点开始。
         *
         */
        this._relayoutBoundary = null;
        /**
         * **为子节点提供新的坐标系**
         * @description
         * 若为`false`, 子节点的`position`将等于其`offset`加上本节点的`position`；
         * 若为`true`，子节点的`position`将直接等于其`offset`（相当于本节点为子节点的坐标系原点）
         *
         * 用于如`ViewContainer`这样的为子节点提供了新的坐标参考系的组件中
         *
         * **请务必在对象初始化完成前确定，后续不应再修改**，若为`true`，
         *
         * 请考虑在`performLayout`中调用子节点的`layout`时传递为子节点提供的控件工厂(可能是`hmUI.widget.GROUP`或`VIEW_CONTAINER`之类的实例).
         */
        this.isNewCoordOrigin = false;
        /**
         * **上一次`layout`时获得的控件工厂**
         * @description
         * 所谓控件工厂，是指`hmUI`、`GROUP`实例或`VIEW_CONTAINER`实例等，拥有符合接口要求的`createWidget`和`deleteWidget`的方法的对象。
         * 请注意区分`hmUI`中的其他方法，控件工厂不一定都实现了这些方法。
         *
         * 在下一次`layout`或取消挂载或转为孤立树等发生前有效。
         */
        this._widgetFactory = null;
        /**
         * **上一次`layout()`时获得的布局约束**
         * @description 布局约束，是指该节点的尺寸的允许范围。
         * 布局约束由`minHeight`，`maxHeight`，`minWidth`和`maxWidth`四个属性构成，详见`Constraints`
         *
         * 应仅当从未布局过时为`null`，其它任何时候都不得将该变量设置为空.
         */
        this._constraints = null;
        /**
         * **渲染就绪状态**
         *
         * 即子节点是否被挂载在可渲染的树上（即根节点是否连接了AsukaUI）
         *
         * 仅当该属性为`true`时，才注册重新布局请求(即调用 `AsukaUI#addRelayoutNode` 或 `AsukaUI#requestRelayout` 方法)
         */
        this._attached = false;
        /**
         * **框架中心**
         * @description
         * 提供处理布局、放置请求，处理基本默认事件，管理活动视图等核心任务。
         *
         * 仅当`this._attach`为`true`时，才允许调用其`AsukaUI#addRelayoutNode` 或 `AsukaUI#requestRelayout` 等方法
         *
         * 目前由AsukaUI创建节点时设置，不应自行修改)
         *
         */
        this._core = null;
        /**
         * **布局尺寸仅由父节点传递的约束决定**
         * @description
         * 该节点的Size是否只与父节点传递的Constrains有关，而不与其它任何因素（如子节点的布局）有关。
         *
         * 换句话说，当父节点传递的布局约束不变时，本节点的子树无论发生产生何种布局变化，本节点的布局尺寸都不变，
         * 父节点就不需要重新布局（布局尺寸是父节点在布局时会参考子节点的唯一因素）
         *
         * 设置为`true`时，该节点将被标记为重布局边界(RelayoutBoundary)，其及其子节点产生的任何布局脏标记都不会传递给父节点，从而实现优化。
         * **如果为`true`，请在`performResize`中计算本节点的布局尺寸，不要在`performLayout`里做出任何计算或改变布局尺寸的操作。**
         *
         * 该属性由子类自行按需设置。
         * 除了对象初始化完成前，**请在改变本属性后调用`markSizedByParentChanged`，**保证布局结果得到正确更新。
         */
        this.sizedByParent = false;
    }
    /**------------------事件处理------------------- */
    /**
     * **添加事件处理器**
     * @param type 事件类型，不区分大小写
     * @param handler 事件处理函数
     */
    addEventListener(type, handler) {
        type = type.toLowerCase();
        (this._handlers[type] || (this._handlers[type] = [])).push(handler);
    }
    /**
     * **删除事件处理器**
     * @param type 事件类型，不区分大小写
     * @param handler 事件处理函数
     */
    removeEventListener(type, handler) {
        type = type.toLowerCase();
        splice(this._handlers[type], handler, undefined, true);
    }
    /**
     * **触发事件**
     * @description 如果要添加默认操作，请在调用本方法后判断`event.defaultPrevented`并决定是否执行默认操作
     * @param event 事件对象
     * @returns
     */
    dispatchEvent(event) {
        let target = event.target || (event.target = this), cancelable = event.cancelable, handlers, i;
        do {
            event.currentTarget = target;
            handlers = target._handlers && target._handlers[event.type];
            if (handlers)
                // 从后往前遍历事件处理函数
                for (i = handlers.length; i--;) {
                    handlers[i].call(target, event);
                    if (cancelable && event._end)
                        break;
                }
        } while (event.bubbles &&
            !(cancelable && event._stop) &&
            (target = target.parentNode));
        return handlers != null;
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        if (key.startsWith('on')) {
            this.addEventListener(key.slice(2), value);
        }
    }
    /**------------------挂载操作------------------- */
    /**
     *  **当元素被挂载到Element树上**
     * @description
     * 即当被作为`mountChild()`的参数并成为子节点时调用。调用时parentNode已为新父元素。
     */
    onMount() { }
    /**
     *  **当元素被从Element树上取消挂载**
     * @description
     * 即当被作为`unmountChild()`的参数时调用。调用时parentNode已为null。
     */
    onUnmount() { }
    /**
     *  **当元素与`AsukaUI`连接（不再孤立）**
     * @description
     * 通常被`attach`调用
     */
    onAttach() { }
    /**
     *  **当元素不再与`AsukaUI`连接（变为孤立）**
     * @description
     * 通常被`detach`调用
     */
    onDetach() { }
    /**
     * **当元素所在树由孤立变为可渲染(即渲染树不与AsukaUI连接)**
     * @description
     * 该方法会通过`visitChildren`遍历所有的子`RenderNode`，并调用它们的`attach`方法、更新节点深度.
     *
     * 本方法需要传递attach调用给子节点以保证子节点`_attached`的正确性。
     *
     * 本方法还需要检测部分边界情况，并作处理。
     * - 当`_attached`为`false`时，也就是该节点未连接到一个可以允许子节点绘制的根节点上（也就是处于“孤立状态”），
     * 在此期间，若该节点的布局因为某些原因（比如回调事件或者布局相关的属性的变化）需要更新布局，由于处于孤立状态，本节点无法进行布局，
     * 更新布局的需求产生了对`markNeedsLayout`的调用，使`_needsLayout`为`true`，若该子节点的`_relayoutBoundary`不为`null`，
     * 则会一直调用`markParentNeedsLayout`直到到达重布局节点，但由于`_attached`为`false`，该节点无法向`AsukaUI`发出重布局请求。
     * 倘若该重布局节点并不是此孤立树的根节点，重新挂载后，由于`mountChild`仅调用挂载父节点的`markNeedsLayout`，
     * 而该重布局节点上方的节点不一定有重布局的需要(可能在其`layout`过程中因为`_needsLayout`为`false`且新传递的约束与之前相同而直接剪枝优化，
     * 而不向下传递`layout`调用)，因此可能导致该节点`_needsLayout`为`true`，却无法得到重新布局。
     * 所以当这种子节点被重新`attach`时，需要使其向`AsukaUI`发送布局请求。
     * - 当`_attached`为`false`时，由于某种原因产生对`markNeedsPlace`的调用类似. 不过`markNeedsPlace`不向上传递脏标记，因此思路较为简单
     */
    attach() {
        assert(!this._attached);
        assert(this.parentNode != null && this.parentNode._depth !== undefined);
        this._attached = true;
        // 重新计算节点的深度
        this._depth = this.parentNode._depth + 1;
        // 如果该节点在孤立状态时被上了布局脏标记（如果是`null`，`markParentNeedsLayout`的调用会传递至孤立树的根节点，
        // 保证沿途每个节点都被标记为脏，并在`mountChild`后得到向下传递的重布局调用）
        assert(() => {
            if (this._relayoutBoundary === null &&
                this._needsLayout &&
                this.parentNode !== null &&
                isRenderNode(this.parentNode)) {
                assert(this.parentNode._needsLayout);
            }
            return true;
        });
        if (this._needsLayout && this._relayoutBoundary !== null) {
            // 重新布局脏标记，使其向`AsukaUI`发出布局请求
            this._needsLayout = false;
            this.markNeedsLayout();
        }
        if (this._needsPlace) {
            // 重新放置脏标记，使其向`AsukaUI`发出放置请求
            this._needsPlace = false;
            this.markNeedsPlace();
        }
        this.onAttach(); // 不能放在前面，否则重新放置脏标记的操作可能导致重复请求放置操作
        // this.markMustCommit();
        this.visitChildren((child) => child.attach());
    }
    /**
     * **当元素所在树由可渲染变为孤立(即渲染树与AsukaUI连接)**
     * @description
     */
    detach() {
        assert(this._attached);
        this._attached = false;
        this.visitChildren((child) => child.detach());
        // 为了让子组件deleteWidget时可能存在的父组件的widgetFactory还在，所以先visitChildren，再调用`onDetach`
        this.onDetach();
        // 注：没必要判断了。因为_core._layout可以判断你有没有_attached。就算你被移动改变了深度，排序也是_layout里面排的
        // // 如果该节点可能注册了重布局节点
        // if(this._relayoutBoundary === this && this._needsLayout) {
        //   assert(this._core != null)
        //   assert(findWhere(this._core!._nodesNeedsLayout, this, true) !== -1)
        //   this._core!.removeRelayoutNode(this)
        // }
        // assert(parent === null || this._attached === (this.parentNode as RenderNode)._attached)
    }
    /**
     * **初始化挂载的子节点**
     * @description
     * 用于挂载节点时设置子节点的插槽属性(parentNode和parentData)等，并将本节点布局标记为脏.
     *
     * **请在使用parentData和parentNode前调用**
     *
     * 通常被`mountChild`调用.
     *
     * @param child 要设置的子节点
     */
    _setupMountingChild(child) {
        child.parentNode = this;
        child.parentData = {};
        this.markNeedsLayout(); // 或许将该职责转移到`mountChild`上
        if (isRenderNode(child)) {
            // (child as RenderNode)._owner = this._owner;
            if (this._attached)
                child.attach(); // 在`markNeedsLayout`后调用（因为里面有断言）
            child.onMount();
            // (child as RenderNode)._cleanRelayoutBoundary();
        }
    }
    /**
     * **设置取消挂载的子节点**
     * @description
     * 用于取消挂载节点时设置子节点的插槽属性(parentNode和parentData)，并清除子树上即将失效(也就是指向本节点或者本节点的祖先)的`_relayoutBoundary`。
     *
     * **请在不使用parentData和parentNode时调用**
     *
     * 通常被`unmountChild`调用.
     *
     * @param child 要设置的子节点
     */
    _setupUnmountingChild(child) {
        child.parentNode = null;
        child.parentData = null;
        if (isRenderNode(child)) {
            child.onUnmount();
            if (this._attached)
                child.detach();
            // 清除子树上即将失效(也就是指向本节点或者本节点的祖先)的`_relayoutBoundary`
            child._cleanRelayoutBoundary();
        }
        this.markNeedsLayout(); // 或许将该职责转移到`unmountChild`上
    }
    /**
     * **设置本节点尺寸**
     *
     * 会检查是否发生变化，如果变化了将自动调用`markNeedsPlace`，使位置得到更新，并自动按需调用`performCommit`.
     *
     * **请按照要求仅在`performResize`或`performLayout`中设置本属性，**其他情况，不应修改该属性，否则可能导致布局错误.
     *
     * 传递不合法的尺寸（负/无穷/NaN）或者`null`将导致错误
     *
     * 会拷贝一个新对象，不会直接使用传参的对象，调用者可以继续修改使用传递的`Size`对象
     */
    set size(size) {
        assert(() => {
            if (!Size.isValid(size)) {
                throw new Error(`Invalid size: ${JSON.stringify(size)}, at ${this.nodeName}, constraint: ${JSON.stringify(this._constraints)}`);
            }
            return true;
        });
        assert(size != null);
        if (!Size.equals(size, this._size)) {
            this.markNeedsPlace();
            // assert(this._sizeChanged === false)
            this._sizeChanged = true;
            this._size = Size.copy(size);
        }
    }
    /**
     * **获取本节点的尺寸**
     *
     * 返回`Size`类型的实例，或`null`
     */
    get size() {
        return this._size;
    }
    /**
     * **设置本节点相对父坐标的偏移**
     *
     * 会检查是否发生变化，如果变化了将自动调用`markNeedsPlace`，使位置得到更新，并自动按需调用`performCommit`.
     *
     * **请按照要求仅在`performLayout`中设置本属性，**其他情况，不应修改该属性，否则可能导致布局错误.
     *
     * 传递不合法的坐标或者`null`将导致错误
     *
     * 会拷贝一个新对象，不会直接使用传参的对象，调用者可以继续修改使用传递的`Coordinate`对象
     */
    set offset(offset) {
        assert(Coordinate.isValid(offset));
        if (offset == null)
            return;
        if (!Coordinate.equals(this._offset, offset)) {
            this._offset = Coordinate.copy(offset);
            this.markNeedsPlace();
        }
    }
    /**
     * **获取本节点相对相对父坐标的偏移**
     *
     * 返回`Coordinate`类型的实例，或`null`
     */
    get offset() {
        return this._offset;
    }
    /**
     * **获取本节点在当前坐标系的位置**
     *
     * 返回`Coordinate`类型的实例，或`null`
     *
     * 所谓`当前坐标系`，是指像`hmUI`，`VIEW_CONTAINER`控件，`GROUP`控件上绘制本节点时，
     * 应当设置的坐标是相对于屏幕原点或者容器控件的位置而言的；`position`就是指正确布局时，在当前容器上绘制时应当设置的正确坐标
     *
     * 确认一个节点的位置，需要先在`layout`过程中确定其`offset`，
     * 并在`place`过程中，通过父节点的`position`(当然父节点为容器时不算这个)+该节点的`offset`，最终得出`position`
     */
    get position() {
        return this._position;
    }
    /**
     * **设置本节点相对父坐标的偏移**
     *
     * 仅应被`place`方法设置，请勿自行调用，**否则可能导致布局错误**，
     *
     * 传递不合法的坐标或者`null`将导致错误
     *
     * 会拷贝一个新对象，不会直接使用传参的对象，调用者可以继续修改使用传递的`Coordinate`对象.
     *
     * 内部不进行任何脏标记或`commit`操作，需要`place`方法实现.
     */
    set position(position) {
        assert(Coordinate.isValid(position));
        if (position == null)
            return;
        if (!Coordinate.equals(this._position, position)) {
            this._position = Coordinate.copy(position);
        }
    }
    /**
     * **有条件地更新子树重布局边界**
     * @description
     * 当节点的_relayoutBoundary不是自己，且父节点的_relayoutBoundary与自己的不相等时，更新并传递给子节点
     */
    _propagateRelayoutBoundary() {
        // _relayoutBoundary 只有三种情况: this / 与父节点的原_relayoutBoundary一致 / null，如果是后两者，就更新
        if (this._relayoutBoundary === this)
            return;
        const parentRelayoutBoundary = this.parentNode._relayoutBoundary;
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
     * 若节点的_relayoutBoundary不是自己，则设为null，并传递给子节点
     */
    _cleanRelayoutBoundary() {
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
    layout(constraints, { parentUsesSize = false, widgetFactory, }) {
        assert(widgetFactory != null &&
            typeof widgetFactory.createWidget === 'function' &&
            typeof widgetFactory.deleteWidget === 'function');
        assert((() => {
            if (!Constraints.isValid(constraints)) {
                throw new Error(`Invalid constraints: ${JSON.stringify(constraints)} \nFrom: [${this.nodeName}]${this.toString()}`);
            }
            return true;
        })());
        this._widgetFactory = widgetFactory;
        // 本节点是否为重布局边界（即布局脏标记是否会传递给本节点的父节点，并触发父节点重新布局）
        let isRelayoutBoundary = !parentUsesSize || // 父节点不使用该节点的Size，也就是该节点的Size是固定的(到下次布局前)，所以该节点子树的布局变化不需要父节点重新布局
            this.sizedByParent || // 该节点的Size只与父节点的Size有关，也就是该节点的子树布局变化不会影响该节点的Size，故不需要父节点重新布局
            constraints.isTight || // 父节点传递了严格布局约束，也就是该节点的Size是固定的(到下次布局前)，那么该节点的子树布局变化不会使该节点的Size变化，故不需要父节点重新布局
            !isRenderNode(this.parentNode); // 父节点不是可渲染节点，子树的布局操作必须由该节点触发
        // 本次布局的重布局边界
        // 本节点的_relayoutBoundary由父节点在layout中设置
        let relayoutBoundary = isRelayoutBoundary
            ? this
            : this.parentNode._relayoutBoundary;
        // 如果该节点没有布局脏标记 且 上次布局的约束对象与本次的相等 （也就是本节点的子树无需重布局）
        if (!this._needsLayout && constraints.equals(this._constraints)) {
            // 更新子树的`relayoutBoundary`并立刻返回（剪枝优化）
            if (relayoutBoundary !== this._relayoutBoundary) {
                this._relayoutBoundary = relayoutBoundary;
                this.visitChildren((child) => child._propagateRelayoutBoundary());
            }
            return;
        }
        this._constraints = constraints;
        // 若原来的`_relayoutBoundary`不为空（也就是上次挂载后已经布局过了，子渲染组件的也一定不为空），且RelayoutBoundary要变了
        if (this._relayoutBoundary !== null &&
            relayoutBoundary !== this._relayoutBoundary) {
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
        this._needsLayout = false;
    }
    /**
     * **在不重新确定尺寸的情况下重新布局**
     *
     * 不会检查`_needsLayout`，请调用前检查并决定是否剪枝
     */
    _layoutWithoutResize() {
        // TODO 检查是否有错
        assert(this._relayoutBoundary === this);
        assert(this.size != null);
        this.performLayout();
        this._needsLayout = false;
    }
    /**
     * **计算节点位置（放置操作）**
     * @description
     * 根据本节点的`offset`和父节点传递的`parentNewPosition`，计算本节点的`position`，并在需要时调用`performCommit`
     * @param parentNewPosition 父节点的新位置(未发生改变或者父节点`isNewCoordOrigin`就无需传参)
     */
    place(parentNewPosition) {
        // TODO 根节点的特殊处理
        assert(isRenderNode(this.parentNode));
        let parentNode = this.parentNode;
        assert(this._offset != null);
        assert(parentNode._position != null);
        if (!this._needsPlace && !parentNewPosition)
            return;
        this._needsPlace = false;
        let position = parentNewPosition
            ? Coordinate.add(parentNewPosition, this.offset)
            : parentNode.isNewCoordOrigin
                ? Coordinate.copy(this.offset)
                : Coordinate.add(this.offset, parentNode._position);
        // TODO copy和equals操作和setter重复了，是否可优化？
        let positionChanged = !Coordinate.equals(position, this._position);
        // TODO 检查并调试代码
        if (positionChanged) {
            this.position = position;
        }
        if (positionChanged || this._sizeChanged || this._mustCommit) {
            this._sizeChanged = this._mustCommit = false;
            this.performCommit();
        }
        if (positionChanged && !this.isNewCoordOrigin) {
            this.visitChildren((child) => child.place(position));
        }
    }
    /**
     * **将该RenderNode标记为需要重新布局**
     */
    markNeedsLayout() {
        if (this._needsLayout)
            return;
        // 从未布局或者被取消挂载的时候自己的重布局边界不是自己
        if (this._relayoutBoundary === null) {
            this._needsLayout = true;
            // TODO 自加测试
            // assert(this.parentNode !== null);
            // _relayoutBoundary is cleaned by an ancestor in RenderObject.layout.
            // Conservatively mark everything dirty until it reaches the closest
            // known relayout boundary.
            if (this.parentNode !== null)
                this.markParentNeedsLayout();
            return;
        }
        if (this._relayoutBoundary !== this) {
            this.markParentNeedsLayout();
        }
        else {
            this._needsLayout = true;
            if (this._attached) {
                this._core.addRelayoutNode(this);
                this._core.requestRelayout();
            }
        }
    }
    /**
     * **将父节点标记为需要重新布局**
     */
    markParentNeedsLayout() {
        assert(this.parentNode !== null);
        this._needsLayout = true;
        this.parentNode.markNeedsLayout();
    }
    /**
     * **标记`sizedByParent`的修改**
     * @description
     * 当在初始化对象以后修改`sizedByParent`时，请调用本方法以确保布局正确更新.
     *
     * 该方法将本节点和父节点标记为脏布局，确保这两个节点的布局都能得到更新.
     */
    markSizedByParentChanged() {
        this.markNeedsLayout();
        this.markParentNeedsLayout();
    }
    /**
     * **标记需要重新计算节点位置（放置脏标记）**
     *
     * 通常不需要手动调用`markNeedsPlace`，因为通常只有当`offset`或父节点的位置可能发生变化时，本节点才需要重新确定位置，而前者只能由`layout`过程中计算，
     * 并在`performLayout`中赋值新的`offset`给子节点时，由子节点的`offset`setter 自动判断是否应调用`markNeedsPlace`;后者会在父节点的`place`方法中调用
     * 子节点的`place`，并不需要用到本脏标记. 另外一个调用来源是`markMustCommit`，因为其需要保证该节点的`place`得到调用，并在其中调用`performCommit`.
     *
     * @see markMustCommit 如果你想让框架保证`performCommit`或`onCommit`得到调用，请另见`markMustCommit`
     */
    markNeedsPlace() {
        // TODO 检查代码
        if (this._needsPlace)
            return;
        this._needsPlace = true;
        if (this._attached) {
            assert(this._core != null);
            this._core.addPlaceNode(this);
            this._core.requestPlace();
        }
        // TODO attached后再处理
    }
    markMustCommit() {
        if (this._mustCommit)
            return;
        this.markNeedsPlace();
    }
}
export class RenderNodeWithNoChild extends RenderNode {
    get firstChild() {
        return null;
    }
    visitChildren(handler) {
        return;
    }
    unmountChild(child) {
        return false;
    }
    mountChild(child, ref) {
        return false;
    }
    getChildNextSibling(child) {
        return null;
    }
}
export class RenderNodeWithSingleChild extends RenderNode {
    constructor() {
        super(...arguments);
        this._child = null;
    }
    set child(child) {
        if (this._child) {
            this.unmountChild(this._child);
            this._child = null;
        }
        if (child != null)
            this.mountChild(child);
    }
    get child() {
        return this._child;
    }
    get firstChild() {
        return this._child;
    }
    visitChildren(handler) {
        if (isRenderNode(this._child)) {
            handler(this._child);
        }
    }
    unmountChild(child) {
        if (this._child !== null && child === this._child) {
            this._setupUnmountingChild(child);
            this._child = null;
            return true;
        }
        return false;
    }
    mountChild(child) {
        if (this._child !== null)
            return false;
        this._child = child;
        this._setupMountingChild(child);
        return true;
    }
    getChildNextSibling(child) {
        return null;
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        if (key === 'child' && value instanceof AsukaNode) {
            this.child = value;
        }
    }
}
/**
 * **可包含多个子节点的RenderNode**
 *
 * 通过双向链表存储子结构
 */
export class RenderNodeWithMultiChildren extends RenderNode {
    constructor() {
        super(...arguments);
        this._firstChild = null;
        this._lastChild = null;
        this._childRenderNodeCount = 0;
    }
    get firstChild() {
        return this._firstChild;
    }
    get childRenderNodeCount() {
        return this._childRenderNodeCount;
    }
    visitChildren(handler) {
        let nowChild = this._firstChild;
        while (nowChild) {
            if (isRenderNode(nowChild))
                handler(nowChild);
            assert(nowChild.parentData.nextSibling !== undefined); // 为null或者AsukaNode
            nowChild = nowChild.parentData.nextSibling;
        }
    }
    unmountChild(child) {
        if (child.parentNode !== this)
            return false;
        let previousSibling = child.parentData.previousSibling;
        let nextSibling = child.parentData.nextSibling;
        if (previousSibling)
            previousSibling.parentData.nextSibling = nextSibling;
        if (nextSibling)
            nextSibling.parentData.previousSibling = previousSibling;
        if (child === this._firstChild) {
            this._firstChild = child.parentData.nextSibling;
        }
        if (child === this._lastChild) {
            this._lastChild = child.parentData.previousSibling;
        }
        this._setupUnmountingChild(child);
        if (isRenderNode(child))
            --this._childRenderNodeCount;
        return true;
    }
    mountChild(child, ref) {
        assert(!child.parentNode);
        if (ref) {
            if (ref.parentNode !== this)
                return false;
            this._setupMountingChild(child);
            let previousSibling = ref.parentData.previousSibling;
            child.parentData.previousSibling = previousSibling;
            ref.parentData.previousSibling = child;
            if (previousSibling)
                previousSibling.parentData.nextSibling = child;
            child.parentData.nextSibling = ref;
            if (ref === this._firstChild)
                this._firstChild = child;
            if (isRenderNode(child))
                ++this._childRenderNodeCount;
            return true;
        }
        else {
            this._setupMountingChild(child);
            let lastChild = this._lastChild;
            this._lastChild = child;
            child.parentData.previousSibling = lastChild;
            if (lastChild)
                lastChild.parentData.nextSibling = child;
            else
                this._firstChild = child;
            child.parentData.nextSibling = null;
            if (isRenderNode(child))
                ++this._childRenderNodeCount;
            return true;
        }
    }
    getChildNextSibling(child) {
        return child.parentData.nextSibling;
    }
}
export class RenderNodeProxy extends RenderNodeWithSingleChild {
    constructor() {
        super(...arguments);
        this.sizedByParent = false;
    }
    performResize() { }
    performLayout() {
        assert(this._constraints != null);
        if (isRenderNode(this.child)) {
            assert(this._widgetFactory != null);
            let child = this.child;
            child.layout(this._constraints, {
                parentUsesSize: true,
                widgetFactory: this._widgetFactory,
            });
            this.size = child.size;
            child.offset = { x: 0, y: 0 };
        }
        else {
            this.size = this._constraints.smallest;
        }
    }
    performCommit() { }
}
/**
 * **事件类**
 * @description
 */
export class AsukaEvent {
    /**
     * **创建事件对象**
     * @param type 事件类型，不区分大小写
     * @param opts 事件属性
     * @property `opts.bubbles` 是否为冒泡类型
     * @property `opts.cancelable` 是否为可以取消
     */
    constructor(type, opts) {
        this.type = type;
        /** 该事件是否已被取消继续冒泡传播(当`cancelable`为`true`时有效) */
        this._stop = false;
        /** 该事件是否已被立即取消继续传播(当`cancelable`为`true`时有效) */
        this._end = false;
        /** 一个布尔值，表示 `preventDefault()` 方法是否取消了事件的默认行为。 */
        this.defaultPrevented = false; // TODO is false should be the default value?
        this.type = type.toLowerCase();
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
/**
 * **视图**
 * @description
 * Element树的根节点。获取一个hmUI控件工厂，并将其传递给子树。
 * 外界访问
 */
export class RenderView extends RenderNodeWithSingleChild {
    constructor({ core, widgetFactory, size, key, offset = { x: 0, y: 0 }, }) {
        super(NodeType.RENDER_NODE, '#frame');
        _RenderView_key.set(this, void 0);
        this._widgetFactory = widgetFactory;
        this._depth = 1;
        this._size = Size.copy(size);
        this._offset = Coordinate.copy(offset);
        this._position = Coordinate.copy(offset);
        this._core = core;
        __classPrivateFieldSet(this, _RenderView_key, key, "f");
        this._attached = true;
        this._relayoutBoundary = this;
        // this.isNewCoordOrigin = true;
    }
    get key() {
        return __classPrivateFieldGet(this, _RenderView_key, "f");
    }
    /**
     * @override
     */
    set size(size) {
        assert(Size.isValid(size));
        if (size == null)
            return;
        if (!Size.equals(size, this._size)) {
            this._size = Size.copy(size);
            this.markNeedsLayout();
        }
    }
    get size() {
        return this._size; // getter 和 setter要同时重载...
    }
    setSize(size) {
        this.size = size;
        return this;
    }
    set offset(offset) {
        assert(Coordinate.isValid(offset));
        if (offset == null)
            return;
        if (!Coordinate.equals(this._offset, offset)) {
            this._offset = Coordinate.copy(offset);
            this._position = Coordinate.copy(offset);
            this.markNeedsPlace();
        }
    }
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    set position(position) {
        assert(Coordinate.isValid(position));
        if (position == null)
            return;
        if (!Coordinate.equals(this._position, position)) {
            this._offset = Coordinate.copy(position);
            this._position = Coordinate.copy(position);
            this.markNeedsPlace();
        }
    }
    setPosition(position) {
        this.position = position;
        return this;
    }
    place() {
        assert(this._offset != null);
        assert(this._position != null);
        if (!this._needsPlace)
            return;
        this._needsPlace = false;
        // }
        if (!this.isNewCoordOrigin) {
            this.visitChildren((child) => child.place(this._position));
        }
    }
    performLayout() {
        assert(this._size != null);
        assert(this._widgetFactory != null);
        if (isRenderNode(this.child)) {
            let child = this.child;
            child.layout(Constraints.createTight(this._size), {
                parentUsesSize: false,
                widgetFactory: this._widgetFactory,
            });
            child.offset = Coordinate.origin();
        }
    }
    performResize() { }
    performCommit() { }
}
_RenderView_key = new WeakMap();
export class RenderWidget extends RenderNodeWithNoChild {
    constructor() {
        super(...arguments);
        this._displaying = false;
    }
    onAttach() {
        this.markMustCommit();
    }
    onDetach() {
        this._displaying = false;
        assert(this._widgetFactory !== null);
        this.onDestroy(this._widgetFactory);
    }
    performCommit() {
        assert(this.size !== null &&
            this.position !== null &&
            this._widgetFactory !== null);
        this.onCommit({
            size: this.size,
            position: this.position,
            initial: !this._displaying,
            widgetFactory: this._widgetFactory,
        });
        this._displaying = true;
    }
}
/**
 *
 */
export class RenderWidgetFactoryProvider extends RenderNodeWithSingleChild {
    constructor() {
        super(...arguments);
        this._displaying = false;
        this.sizedByParent = false;
        this.childWidgetFactory = null;
    }
    onAttach() {
        this.markMustCommit();
    }
    onDetach() {
        this._displaying = false;
        assert(this._widgetFactory !== null);
        this.onDestroy(this._widgetFactory);
    }
    performResize() { }
    /// 行为类似`RenderNodeProxy`，只不过替换了传给子控件的`widgetFactory`
    performLayout() {
        assert(this._constraints != null);
        if (isRenderNode(this.child)) {
            assert(this._widgetFactory != null);
            assert(this.childWidgetFactory != null);
            let child = this.child;
            child.layout(this._constraints, {
                parentUsesSize: true,
                widgetFactory: this.childWidgetFactory,
            });
            this.size = child.size;
            child.offset = { x: 0, y: 0 };
        }
        else {
            this.size = this._constraints.smallest;
        }
    }
    performCommit() {
        assert(this.size !== null &&
            this.position !== null &&
            this._widgetFactory !== null);
        this.onCommit({
            size: this.size,
            position: this.position,
            initial: !this._displaying,
            widgetFactory: this._widgetFactory,
        });
        this._displaying = true;
    }
}
export class AsukaUI {
    constructor() {
        this.viewRecord = {};
        this._activeFrame = null;
        this._nodeFactories = [];
        /** 需要重新布局的起始节点 */
        this._nodesNeedsLayout = [];
        /** 需要重新放置的节点 */
        this._nodesNeedsPlace = [];
        /** 在布局和放置任务完成后调用的任务 */
        this._runAfterTasks = [];
        /** 异步管理器句柄(可能是setTimeout或者Promise之类的) */
        this._asyncHandler = null;
        assert(AsukaUI.instance === null);
        AsukaUI.instance = this;
    }
    get activeFrame() {
        return this._activeFrame;
    }
    set activeFrame(frame) {
        // TODO
        this._activeFrame = frame;
    }
    mountView(mount = hmUI, options) {
        let size = options && options.size;
        let offset = (options && options.offset) || { x: 0, y: 0 };
        if (!size) {
            if (mount === hmUI) {
                let { width, height } = getDeviceInfo();
                size = { w: width, h: height };
            }
            else {
                try {
                    size = {
                        w: mount.getProperty(hmUI.prop.W),
                        h: mount.getProperty(hmUI.prop.H),
                    };
                }
                catch (_a) {
                    reportError('createFrame', Error('Get View size failed'));
                }
            }
        }
        if (!size)
            throw Error('Get View size failed');
        let view = new RenderView({
            widgetFactory: mount,
            core: this,
            size,
            key: Symbol('Asuka View'),
            offset,
        });
        this.viewRecord[view.key] = view;
        return view;
    }
    unmountView(view) {
        if (!view._attached || !this.viewRecord[view.key])
            return false;
        view.detach();
        this.viewRecord[view.key] = null;
        return true;
    }
    registerNodeFactory(nodeFactory) {
        this._nodeFactories.push(nodeFactory);
    }
    createNode(type) {
        let element = null;
        for (let nodeFactory of this._nodeFactories) {
            element = nodeFactory.createNode(type);
            if (element)
                break;
        }
        if (element !== null && isRenderNode(element)) {
            element._core = this;
        }
        return element;
    }
    createTextNode(text) {
        return new AsukaTextNode(text);
    }
    /**
     * **添加需要重新布局的节点**
     */
    addRelayoutNode(node) {
        assert(findWhere(this._nodesNeedsLayout, node, true) === -1);
        this._nodesNeedsLayout.push(node);
    }
    /**
     * **移除需要重新布局的节点**
     */
    removeRelayoutNode(node) {
        return splice(this._nodesNeedsLayout, node) !== -1;
    }
    /**
     * **请求重新布局**
     */
    requestRelayout() {
        if (this._asyncHandler === null) {
            this._asyncHandler = setTimeout(() => this._layoutAndPlace());
        }
    }
    /**
     * **添加需要重新布局的节点**
     */
    addPlaceNode(node) {
        assert(findWhere(this._nodesNeedsPlace, node, true) === -1);
        this._nodesNeedsPlace.push(node);
    }
    /**
     * **移除需要重新布局的节点**
     */
    removePlaceNode(node) {
        return splice(this._nodesNeedsPlace, node) !== -1;
    }
    /**
     * **请求重新布局**
     */
    requestPlace() {
        if (this._asyncHandler === null) {
            this._asyncHandler = setTimeout(() => this._layoutAndPlace());
        }
    }
    /**
     * **取消重新布局**
     */
    cancelRelayout() {
        if (this._asyncHandler !== null)
            clearTimeout(this._asyncHandler);
    }
    refreshSync() {
        if (this._asyncHandler !== null) {
            clearTimeout(this._asyncHandler);
            this._layoutAndPlace();
        }
    }
    /**
     * **添加布局与放置后的任务**
     *
     * 将在`layout`和`place`完成后调用，并清空任务队列
     * @param task 要执行的任务
     */
    addRunAfterAsync(task) {
        this._runAfterTasks.push(task);
    }
    /**
     * 重新布局时调用的
     */
    _layoutAndPlace() {
        // TODO
        this._asyncHandler = null;
        this._layout();
        this._place();
        this._runAfter();
    }
    _layout() {
        // TODO 检查
        // 按深度从小到大排序
        this._nodesNeedsLayout.sort((node1, node2) => node1._depth - node2._depth);
        for (let node of this._nodesNeedsLayout) {
            if (node._needsLayout && node._attached)
                node._layoutWithoutResize();
        }
        this._nodesNeedsLayout = [];
    }
    _place() {
        // TODO 检查
        this._nodesNeedsPlace.sort((node1, node2) => node1._depth - node2._depth);
        for (let node of this._nodesNeedsPlace) {
            if (node._needsPlace && node._attached)
                node.place();
        }
        this._nodesNeedsPlace = [];
    }
    _runAfter() {
        for (let task of this._runAfterTasks) {
            task();
        }
        this._runAfterTasks = [];
    }
}
AsukaUI.instance = null;
//# sourceMappingURL=base.js.map