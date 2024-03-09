/**
 * **布局约束类**
 * @description 布局约束，是指该节点的尺寸的允许范围。
 * 布局约束由`minHeight`，`maxHeight`，`minWidth`和`maxWidth`四个属性构成，详见`Constraints`
 *
 * 符合该约束的尺寸满足`minHeight <= height <= maxHeight`且`minWidth <= width <= maxWidth`.
 *
 * 当`minHeight == maxHeight`且`minWidth == maxWidth`时，称该约束为*严格约束*，意味着满足该约束的尺寸仅有一种.
 *
 * 当`minHeight == 0`且`minWidth == 0`时，该约束为*宽松约束*，意味着没有最小尺寸限制.
 *
 * **一个节点的最终尺寸必须符合其父节点传递的布局约束.**
 *
 * 框架保证所有`Constraints`类型的约束合理且有效，但请注意无穷大约束的处理。无穷大的尺寸将导致错误。
 *
 * @todo 处理`NaN`的情况
 */
export declare class Constraints {
    minHeight: number;
    maxHeight: number;
    minWidth: number;
    maxWidth: number;
    constructor({ minHeight, maxHeight, minWidth, maxWidth, }: {
        minHeight?: number;
        maxHeight?: number;
        minWidth?: number;
        maxWidth?: number;
    });
    /**
     * **创建一个严格约束**
     * @description 给定一个`Size`对象，返回一个`Constraints`对象，
     * 使得满足该`Constraints`约束的`Size`仅有给定的`Size`一种
     * @param size
     * @returns
     */
    static createTight(size: NullableSize): Constraints;
    static isValid(constraints: Constraints | null): boolean;
    static copy(constraints: Constraints): Constraints;
    copy(): Constraints;
    /**
     * 返回一个新的约束对象，使其在遵守原约束对象的同时尽可能向指定的长宽缩进
     * @param param0
     */
    tighten({ width, height }: {
        width?: number;
        height?: number;
    }): Constraints;
    /**
     * **约束操作**
     * @description
     * 将给定的Size对象以最小改动约束至该Constraints
     *
     * **将直接修改源对象**
     * @param size 需要约束的Size对象
     */
    constrain(size: Size): Size;
    /**
     * **适应操作**
     * @description
     * 将该Constraints通过最小改动符合给定的Constraints
     *
     * **将直接修改源对象**
     * @param size 需要约束的Size对象
     */
    adoptBy(constrain: Constraints): this;
    /**
     * **宽松化**
     * @description
     * 将`minHeight`和`minWidth`的限制去除（设为0），返回一个新Constrains对象，不会改变原Constrains对象
     * @returns 宽松化后的Constrains对象
     */
    loose(): Constraints;
    /**
     * **返回符合该约束的最大尺寸**
     */
    get biggest(): Size;
    /**
     * **返回符合该约束的最小尺寸**
     */
    get smallest(): Size;
    /**
     * **是否为严格约束**
     * @description
     * 即`minHeight`与`maxHeight`是否相等，且`minWidth`与`maxWidth`是否相等
     */
    get isTight(): boolean;
    /**
     * **判断两个Constrains对象是否相等**
     * @description
     * 当两个Constrains对象的`minHeight`、`maxHeight`、`minWidth`、`maxWidth`均相等时，返回true，否则为false
     * @param other 另一个Constrains对象
     * @returns 两个Constraints是否相等（当other参数为null时始终返回false）
     */
    equals(other: Constraints | null): boolean;
    toString(): string;
    /**
     * **检测一个`Size`对象是否符合本约束要求**
     * @param size 要检测的`Size`对象
     */
    testSize(size: Size): boolean;
}
export declare class Size {
    static equals(size1: Size | null, size2: Size | null): boolean;
    static isValid(size: Size | null): boolean;
    /**
     * **判断一个`Size`对象是不是有穷的**
     * @param size 要判断的`Size`对象
     * @returns 是否有穷
     */
    static isFinite(size: Size): boolean;
    static copy(size: Size): {
        w: number;
        h: number;
    };
    /**
     * **分别相加两个`Size`对象的长和宽，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param size1
     * @param size2
     * @returns 累加后的新对象
     */
    static add(size1: Size, size2: Size): Size;
    /**
     * **分别相减两个`Size`对象的长和宽，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param size1
     * @param size2
     * @returns 累加后的新对象
     */
    static remove(size1: Size, size2: Size): Size;
}
export interface Size {
    w: number;
    h: number;
}
export interface NullableSize {
    w?: number;
    h?: number;
}
export interface Coordinate {
    x: number;
    y: number;
}
export declare class Coordinate {
    static copy(coord: Coordinate): {
        x: number;
        y: number;
    };
    static isValid(coord: Coordinate | null): boolean;
    static origin(): Coordinate;
    static equals(coord1: Coordinate | null, coord2: Coordinate | null): boolean;
    /**
     * **分别相加两个`Coordinate`对象的`x`和`y`，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param coord1
     * @param coord2
     * @returns 累加后的新对象
     */
    static add(coord1: Coordinate, coord2: Coordinate): Coordinate;
}
export declare class Alignment {
    _x: number;
    _y: number;
    /**
     * **创建对齐**
     * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
     * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
     */
    constructor(x?: number | null, y?: number | null);
    /**
     * **创建对齐**
     * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
     * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
     */
    static create(x?: number | null, y?: number | null): Alignment;
    static get topLeft(): Alignment;
    static get top(): Alignment;
    static get topRight(): Alignment;
    static get centerLeft(): Alignment;
    static get center(): Alignment;
    static get centerRight(): Alignment;
    static get bottomLeft(): Alignment;
    static get bottom(): Alignment;
    static get bottomRight(): Alignment;
    /**
     * **计算子偏移量**
     *
     * 根据两个尺寸（一个父一个子），计算子满足该`Alignment`对象时相对父的坐标坐标
     * @param parentSize 父尺寸
     * @param childSize 子尺寸
     * @returns 子相对父的偏移坐标
     * @todo 加上子大于父的判断
     */
    calcOffset(parentSize: Size, childSize: Size): Coordinate;
    static copy(alignment: Alignment): Alignment;
}
/**
 * **轴向**
 */
export declare enum Axis {
    /**
     * **水平**
     */
    horizontal = 0,
    /**
     * **竖直**
     */
    vertical = 1
}
/**
 * 翻转轴向（水平变成垂直，垂直变成水平）
 * @param axis
 * @returns
 */
export declare function flipAxis(axis: Axis): Axis;
/**
 * **主轴对齐方式**
 */
export declare enum MainAxisAlignment {
    /**
     * **顶头**
     */
    start = 0,
    /**
     * **接尾**
     */
    end = 1,
    /**
     * **居中**
     */
    center = 2,
    /**
     * **顶头**接尾，其他均分
     */
    spaceBetween = 3,
    /**
     * **中间**的孩子均分,两头的孩子空一半
     */
    spaceAround = 4,
    /**
     * **均匀**平分
     */
    spaceEvenly = 5
}
/**
 * **交叉对齐方式**
 */
export declare enum CrossAxisAlignment {
    /**
     * **顶头**
     */
    start = 0,
    /**
     * **接尾**
     */
    end = 1,
    /**
     * **居中**
     */
    center = 2,
    /**
     * **伸展**
     */
    stretch = 3,
    /**
     * **基线**
     */
    baseline = 4
}
/**
 * **主轴尺寸**
 */
export declare enum MainAxisSize {
    /**
     * **尽可能小**
     */
    min = 0,
    /**
     * **尽可能大**
     */
    max = 1
}
/**
 * **水平排布方向**
 */
export declare enum HorizontalDirection {
    /**
     * **从左到右**
     */
    ltr = 0,
    /**
     * **从右到左**
     */
    rtl = 1
}
/**
 * **竖直排布方向**
 */
export declare enum VerticalDirection {
    /**
     * **向上（从下到上）**
     */
    up = 0,
    /**
     * **向下（从上到下）**
     */
    down = 1
}
/**
 * **文字基线**
 */
export declare enum TextBaseline {
    alphabetic = 0,
    ideographic = 1
}
/**
 * **Flexible组件的尺寸适应方式**
 */
export declare enum FlexFit {
    /**
     * **强制子节点尺寸为可能的最大值**
     */
    tight = 0,
    /**
     * **允许子节点尺寸在最大值以内自由选择**
     * @todo 这个到底是啥意思？
     */
    loose = 1
}
/**
 * **边距**
 */
export declare class EdgeInsets {
    _left: number;
    _up: number;
    _right: number;
    _down: number;
    constructor({ left, up, right, down, }: {
        left: number;
        up: number;
        right: number;
        down: number;
    });
    static all(value: number): EdgeInsets;
    static only(value?: {
        left?: number;
        up?: number;
        right?: number;
        down?: number;
    }): EdgeInsets;
    static symmetric({ vertical, horizontal, }: {
        vertical: number;
        horizontal: number;
    }): EdgeInsets;
    static get zero(): EdgeInsets;
    equals(e: EdgeInsets | null): boolean;
    get horizontalTotal(): number;
    get verticalTotal(): number;
    getInnerConstraints(outterConstraints: Constraints): Constraints;
    /**
     * **获取仅包含padding占用空间的`Size`对象**
     */
    get totalSizeWithoutInner(): Size;
    getOutterSize(innerSize: Size): Size;
    get innerOffset(): Coordinate;
}
export declare enum StackFit {
    /**
     * 将Stack的约束宽松后传给子组件
     */
    loose = 0,
    /**
     * 将Stack的约束严格化后传给子组件
     */
    expand = 1,
    /**
     * 将Stack的约束原样传递给子组件
     */
    passthrough = 2
}
//# sourceMappingURL=layout.d.ts.map