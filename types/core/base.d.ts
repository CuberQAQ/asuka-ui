import { Constraints, Coordinate, Size } from './layout';
/**
 * **节点类**
 */
export declare abstract class AsukaNode {
    /** 节点类型 */
    nodeType: number;
    /** 节点名称 */
    nodeName: string;
    /** 父节点 */
    parentNode: AsukaNode | null;
    /**
     * **父节点数据插槽**
     * @description
     * 用于存储父节点希望子节点存储的信息。
     *
     * 由于子模型无关、布局算法高度自定义等特点，出现父节点需要子节点存储数据的情况十分常见，故提供本插槽属性。
     * 将在`mountChild`时调用的`_setupMountingChild`中赋值为`{}`(空对象)进行初始化，并在`unmountChild`时调用的`_setupUnmounting`中赋值为`null`进行清除。
     * 其他任何时候，框架不会访问或改变它。
     *
     * 举例：多个采用双向链表存储子节点时诸如`nextSibling`，`previousSibling`等。
     */
    parentData: any;
    /**
     * **获取子节点的下一个下一个兄弟节点**
     * @description
     * 不可构成循环链表
     * @override 拥有子节点的考虑重载本方法
     * @param child 子节点
     * @returns 下一个兄弟节点
     */
    abstract getChildNextSibling(child: AsukaNode): AsukaNode | null;
    /** 子节点中位于首项的节点 */
    abstract get firstChild(): AsukaNode | null;
    get nextSibling(): AsukaNode | null;
    /**
     * **取消挂载指定的子节点**
     * @param child 要取消挂载的子节点
     * @returns 是否成功
     */
    abstract unmountChild(child: AsukaNode): boolean;
    /**
     * **添加一个子节点**
     * @description
     * 插入一个子节点 或 追加一个子节点到子节点列表末端。
     * 指定`ref`时为插入操作，否则为追加操作。
     * @param child 要插入或添加的子节点
     * @param ref 要插入的子节点后面的子节点
     * @returns 是否成功
     */
    abstract mountChild(child: AsukaNode, ref?: AsukaNode | null): boolean;
    constructor(
    /** 节点类型 */
    nodeType: number, 
    /** 节点名称 */
    nodeName: string);
    /**------------------属性设置------------------- */
    /**
     * **设置元素属性**
     * @param key 属性键
     * @param value 属性值
     */
    setProperty(key: string, value: any): void;
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
    get firstChild(): AsukaNode | null;
    getChildNextSibling(child: AsukaNode): AsukaNode | null;
    mountChild(child: AsukaNode, ref?: AsukaNode | null): boolean;
    unmountChild(child: AsukaNode): boolean;
}
/**
 * **未知节点类**
 */
export declare class AsukaUnknownNode extends AsukaNode {
    constructor();
    get firstChild(): AsukaNode | null;
    getChildNextSibling(child: AsukaNode): AsukaNode | null;
    mountChild(child: AsukaNode, ref?: AsukaNode | null): boolean;
    unmountChild(child: AsukaNode): boolean;
}
/**
 * **可渲染节点**
 * @description
 * 涉及布局、绘制、事件都是可渲染节点
 */
export declare abstract class RenderNode extends AsukaNode {
    protected _handlers: {
        [key: string]: Function[];
    };
    constructor(nodeTyle: number | null, nodeName: string);
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
    /**------------------挂载操作------------------- */
    /**
     *  **当元素被挂载到Element树上**
     * @description
     * 即当被作为`mountChild()`的参数并成为子节点时调用。调用时parentNode已为新父元素。
     */
    onMount(): void;
    /**
     *  **当元素被从Element树上取消挂载**
     * @description
     * 即当被作为`unmountChild()`的参数时调用。调用时parentNode已为null。
     */
    onUnmount(): void;
    /**
     *  **当元素与`AsukaUI`连接（不再孤立）**
     * @description
     * 通常被`attach`调用
     */
    onAttach(): void;
    /**
     *  **当元素不再与`AsukaUI`连接（变为孤立）**
     * @description
     * 通常被`detach`调用
     */
    onDetach(): void;
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
    attach(): void;
    /**
     * **当元素所在树由可渲染变为孤立(即渲染树与AsukaUI连接)**
     * @description
     */
    detach(): void;
    /**------------------子节点操作------------------- */
    /** 子节点中位于首项的节点 */
    abstract get firstChild(): AsukaNode | null;
    /** **遍历子渲染节点** */
    abstract visitChildren(handler: (child: RenderNode) => void): void;
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
    protected _setupMountingChild(child: AsukaNode): void;
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
    protected _setupUnmountingChild(child: AsukaNode): void;
    /**
     * **取消挂载指定的子节点**
     * @param child 要取消挂载的子节点
     * @returns 是否取消挂载成功
     * @abstract **子类重载该方法时必须调用`_setupUnmountingChild()`**
     */
    abstract unmountChild(child: AsukaNode): boolean;
    /**
     * **添加一个子节点**
     * @description
     * 插入一个子节点 或 追加一个子节点到子节点列表末端。
     * 指定`ref`时为插入操作，否则为追加操作。
     * @param child 要插入或添加的子节点
     * @param ref 要插入的子节点后面的子节点
     * @returns 是否成功
     * @abstract **子类重载该方法时必须调用`_setupMountingChild()`**
     */
    abstract mountChild(child: AsukaNode, ref?: AsukaNode): boolean;
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
    _needsLayout: boolean;
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
    _needsPlace: boolean;
    /**
     * **必须执行推送操作(强制更新标记)**
     *
     * 框架应保证所有非孤立且拥有强制更新标记的节点的`performCommit`和`onCommit`都被调用，并将该标记清除，并且应迅速(在下一个JS事件循环时，`place`过程中)
     * 若为孤立且拥有脏标记的节点，在转为非孤立状态后应立即请求放置，并在下一个JS事件循环时的`place`时执行推送操作，并清除脏标记。
     */
    _mustCommit: boolean;
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
    _depth: number;
    /**
     * **本节点尺寸**
     *
     * 请勿直接修改本属性，而是通过`size`(getter/setter)修改或访问
     */
    _size: Size | null;
    /**
     * **本节点尺寸是否已改变**
     *
     * 用途：
     * - 在`size`setter中判断并标记为`true`.
     * - 在`place`方法中用于判断是否需要执行`performCommit`操作，并将其标记为`false`
     */
    _sizeChanged: boolean;
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
    set size(size: Size | null);
    /**
     * **获取本节点的尺寸**
     *
     * 返回`Size`类型的实例，或`null`
     */
    get size(): Size | null;
    /**
     * **相对父节点的坐标偏移**
     *
     * 请勿直接修改本属性，而是通过`offset`(getter/setter)修改或访问
     */
    _offset: Coordinate | null;
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
    set offset(offset: Coordinate | null);
    /**
     * **获取本节点相对相对父坐标的偏移**
     *
     * 返回`Coordinate`类型的实例，或`null`
     */
    get offset(): Coordinate | null;
    /**
     * **该节点在当前坐标系的位置**
     *
     * 请勿直接修改本属性，而是通过`position`(getter/setter)修改或访问
     */
    _position: Coordinate | null;
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
    get position(): Coordinate | null;
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
    set position(position: Coordinate | null);
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
    _relayoutBoundary: RenderNode | null;
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
    isNewCoordOrigin: boolean;
    /**
     * **上一次`layout`时获得的控件工厂**
     * @description
     * 所谓控件工厂，是指`hmUI`、`GROUP`实例或`VIEW_CONTAINER`实例等，拥有符合接口要求的`createWidget`和`deleteWidget`的方法的对象。
     * 请注意区分`hmUI`中的其他方法，控件工厂不一定都实现了这些方法。
     *
     * 在下一次`layout`或取消挂载或转为孤立树等发生前有效。
     */
    _widgetFactory: WidgetFactory | null;
    /**
     * **上一次`layout()`时获得的布局约束**
     * @description 布局约束，是指该节点的尺寸的允许范围。
     * 布局约束由`minHeight`，`maxHeight`，`minWidth`和`maxWidth`四个属性构成，详见`Constraints`
     *
     * 应仅当从未布局过时为`null`，其它任何时候都不得将该变量设置为空.
     */
    _constraints: Constraints | null;
    /**
     * **渲染就绪状态**
     *
     * 即子节点是否被挂载在可渲染的树上（即根节点是否连接了AsukaUI）
     *
     * 仅当该属性为`true`时，才注册重新布局请求(即调用 `AsukaUI#addRelayoutNode` 或 `AsukaUI#requestRelayout` 方法)
     */
    _attached: boolean;
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
    _core: AsukaUI | null;
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
    sizedByParent: boolean;
    /**
     * **有条件地更新子树重布局边界**
     * @description
     * 当节点的_relayoutBoundary不是自己，且父节点的_relayoutBoundary与自己的不相等时，更新并传递给子节点
     */
    protected _propagateRelayoutBoundary(): void;
    /**
     * **有条件地清空子树重布局边界**
     * @description
     * 若节点的_relayoutBoundary不是自己，则设为null，并传递给子节点
     */
    protected _cleanRelayoutBoundary(): void;
    /**
     * **布局算法**
     * @param constraints 布局约束，要求该RenderNode的尺寸应符合该约束
     * @param parentUsesSize 父节点在 layout 时会不会使用当前节点的 size 信息(也就是当前节点的排版信息对父节点有无影响)；
     */
    layout(constraints: Constraints, { parentUsesSize, widgetFactory, }: {
        parentUsesSize: boolean;
        widgetFactory: WidgetFactory;
    }): void;
    /**
     * **在不重新确定尺寸的情况下重新布局**
     *
     * 不会检查`_needsLayout`，请调用前检查并决定是否剪枝
     */
    _layoutWithoutResize(): void;
    /**
     * **计算节点位置（放置操作）**
     * @description
     * 根据本节点的`offset`和父节点传递的`parentNewPosition`，计算本节点的`position`，并在需要时调用`performCommit`
     * @param parentNewPosition 父节点的新位置(未发生改变或者父节点`isNewCoordOrigin`就无需传参)
     */
    place(parentNewPosition?: Coordinate): void;
    /**
     * **将该RenderNode标记为需要重新布局**
     */
    markNeedsLayout(): void;
    /**
     * **将父节点标记为需要重新布局**
     */
    markParentNeedsLayout(): void;
    /**
     * **标记`sizedByParent`的修改**
     * @description
     * 当在初始化对象以后修改`sizedByParent`时，请调用本方法以确保布局正确更新.
     *
     * 该方法将本节点和父节点标记为脏布局，确保这两个节点的布局都能得到更新.
     */
    markSizedByParentChanged(): void;
    /**
     * **标记需要重新计算节点位置（放置脏标记）**
     *
     * 通常不需要手动调用`markNeedsPlace`，因为通常只有当`offset`或父节点的位置可能发生变化时，本节点才需要重新确定位置，而前者只能由`layout`过程中计算，
     * 并在`performLayout`中赋值新的`offset`给子节点时，由子节点的`offset`setter 自动判断是否应调用`markNeedsPlace`;后者会在父节点的`place`方法中调用
     * 子节点的`place`，并不需要用到本脏标记. 另外一个调用来源是`markMustCommit`，因为其需要保证该节点的`place`得到调用，并在其中调用`performCommit`.
     *
     * @see markMustCommit 如果你想让框架保证`performCommit`或`onCommit`得到调用，请另见`markMustCommit`
     */
    markNeedsPlace(): void;
    markMustCommit(): void;
    /**
     * **重新确定尺寸**
     *
     * 仅当`sizedByParent`为`true`时会被调用.
     *
     * 应当只使用父节点传递的布局约束计算节点，而不使用本节点的任何信息. 否则，请保持`sizedByParent`设为`false`，并在`performLayout`中确认尺寸.
     *
     * 框架保证`performResize`调用前，新的布局约束已赋值给`_constraints`属性，因此实现本方法时，
     * 仅需读取`this._constraints`，并将结果保存至`this.size`.
     */
    abstract performResize(): void;
    /**
     * **布局操作**
     *
     * 本方法的通常职责：
     * 1. 计算子节点的约束，调用其`layout`方法，使子节点计算尺寸.
     * 2. 确定自己的尺寸，并将结果赋值给`this.size`
     * 3. 计算子节点相对自己的坐标偏移，赋值给子节点的`offset`属性.
     *
     * 注意点：
     * - **实现本方法时，应无条件调用所有子节点的`layout`方法**
     * - 当本节点的尺寸仅与父节点传递的布局约束有关是，将`sizedByParent`设置为`true`可以优化布局流程，
     * 但计算自己尺寸的过程应当放在`performResize`里，本方法不应计算尺寸.
     */
    abstract performLayout(): void;
    /**
     * **推送布局与放置结果**
     * @description
     * 当`size`或`position`发生变化或调用了`markMustCommit`，将执行并用于更新绘制组件.
     *
     * 框架保证调用该方法时，`size`和`position`的内容均为有效数字、`_widgetFactory`为有效控件工厂.
     */
    abstract performCommit(): void;
}
export declare abstract class RenderNodeWithNoChild extends RenderNode {
    get firstChild(): AsukaNode | null;
    visitChildren(handler: (child: RenderNode) => void): void;
    unmountChild(child: AsukaNode): boolean;
    mountChild(child: AsukaNode, ref?: AsukaNode | null): boolean;
    getChildNextSibling(child: AsukaNode): AsukaNode | null;
}
export declare abstract class RenderNodeWithSingleChild extends RenderNode {
    _child: AsukaNode | null;
    set child(child: AsukaNode | null);
    get child(): AsukaNode | null;
    get firstChild(): AsukaNode | null;
    visitChildren(handler: (child: RenderNode) => void): void;
    unmountChild(child: AsukaNode): boolean;
    mountChild(child: AsukaNode): boolean;
    getChildNextSibling(child: AsukaNode): AsukaNode | null;
    setProperty(key: string, value: any): void;
}
/**
 * **可包含多个子节点的RenderNode**
 *
 * 通过双向链表存储子结构
 */
export declare abstract class RenderNodeWithMultiChildren extends RenderNode {
    _firstChild: AsukaNode | null;
    _lastChild: AsukaNode | null;
    _childRenderNodeCount: number;
    get firstChild(): AsukaNode | null;
    get childRenderNodeCount(): number;
    visitChildren(handler: (child: RenderNode) => void): void;
    unmountChild(child: AsukaNode): boolean;
    mountChild(child: AsukaNode, ref?: AsukaNode | null): boolean;
    getChildNextSibling(child: AsukaNode): AsukaNode | null;
}
export declare class RenderNodeProxy extends RenderNodeWithSingleChild {
    sizedByParent: boolean;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
}
/**
 * **事件类**
 * @description
 */
export declare class AsukaEvent {
    type: string;
    bubbles: boolean;
    /** 触发事件的元素, 默认为调用`depatchEvent()`的元素 */
    target?: RenderNode;
    /** 正在响应该事件的元素 */
    currentTarget?: RenderNode;
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
/**
 * **视图**
 * @description
 * Element树的根节点。获取一个hmUI控件工厂，并将其传递给子树。
 * 外界访问
 */
export declare class RenderView extends RenderNodeWithSingleChild {
    #private;
    constructor({ core, widgetFactory, size, key, offset, }: {
        core: AsukaUI;
        widgetFactory: WidgetFactory;
        size: Size;
        key: string | symbol;
        offset: Coordinate;
    });
    get key(): string | symbol;
    /**
     * @override
     */
    set size(size: Size | null);
    get size(): Size | null;
    setSize(size: Size): this;
    set offset(offset: Coordinate | null);
    setOffset(offset: Coordinate): this;
    set position(position: Coordinate | null);
    setPosition(position: Coordinate): this;
    place(): void;
    performLayout(): void;
    performResize(): void;
    performCommit(): void;
}
export declare abstract class RenderWidget extends RenderNodeWithNoChild {
    protected _displaying: boolean;
    /**
     * **创建组件或更新布局**
     * @description
     * 当布局更新或者初始化时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
     * @param layout 布局信息
     * @param initial 是否为初始化
     * @param widgetFactory 控件工厂（仅应在onCommit调用开始到onDestory调用期间使用，因为其他时候可能发生改变）
     */
    abstract onCommit({ size, position, widgetFactory, initial, }: {
        size: Size;
        position: Coordinate;
        widgetFactory: WidgetFactory;
        initial?: boolean;
    }): void;
    /**
     * **删除组件**
     * @description
     * 当控件被移出可渲染树时调用。不应在此方法内修改已有属性，即使为初始化时（因为有可能再次调用`onCommit`）
     */
    abstract onDestroy(widgetFactory: WidgetFactory): void;
    onAttach(): void;
    onDetach(): void;
    abstract performResize(): void;
    abstract performLayout(): void;
    performCommit(): void;
}
export interface WidgetFactory {
    createWidget(widgetType: number, option: Record<string, any>): any;
    deleteWidget(widget: any): void;
}
export interface NodeFactory {
    createNode(type: string): AsukaNode | null;
}
export declare class AsukaUI {
    viewRecord: Record<string | symbol, RenderView | null>;
    protected _activeFrame: RenderView | null;
    protected _nodeFactories: NodeFactory[];
    static instance: AsukaUI | null;
    constructor();
    get activeFrame(): RenderView | null;
    set activeFrame(frame: RenderView | null);
    mountView(mount?: WidgetFactory, options?: {
        size?: Size;
        offset?: Coordinate;
    }): RenderView;
    unmountView(view: RenderView): boolean;
    registerNodeFactory(nodeFactory: NodeFactory): void;
    createNode(type: string): AsukaNode | null;
    createTextNode(text: string): AsukaTextNode;
    /** 需要重新布局的起始节点 */
    _nodesNeedsLayout: RenderNode[];
    /** 需要重新放置的节点 */
    _nodesNeedsPlace: RenderNode[];
    /** 异步管理器句柄(可能是setTimeout或者Promise之类的) */
    _asyncHandler: number | null;
    /**
     * **添加需要重新布局的节点**
     */
    addRelayoutNode(node: RenderNode): void;
    /**
     * **移除需要重新布局的节点**
     */
    removeRelayoutNode(node: RenderNode): boolean;
    /**
     * **请求重新布局**
     */
    requestRelayout(): void;
    /**
     * **添加需要重新布局的节点**
     */
    addPlaceNode(node: RenderNode): void;
    /**
     * **移除需要重新布局的节点**
     */
    removePlaceNode(node: RenderNode): boolean;
    /**
     * **请求重新布局**
     */
    requestPlace(): void;
    /**
     * **取消重新布局**
     */
    cancelRelayout(): void;
    refreshSync(): void;
    /**
     * 重新布局时调用的
     */
    _layoutAndPlace(): void;
    _layout(): void;
    _place(): void;
}
//# sourceMappingURL=base.d.ts.map