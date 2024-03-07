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
    static createTight(size: Size): Constraints;
    static isValid(constraints: Constraints | null): boolean;
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
     * **宽松化**
     * @description
     * 将`minHeight`和`minWidth`的限制去除（设为0），返回一个新Constrains对象，不会改变原Constrains对象
     * @returns 宽松化后的Constrains对象
     */
    loose(): Constraints;
    /**
     * **返回符合该约束的最大尺寸**
     */
    maxSize(): Size;
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
}
export declare class Size {
    static equals(size1: Size | null, size2: Size | null): boolean;
    static isValid(size: Size | null): boolean;
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
}
export interface Size {
    w: number;
    h: number;
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
//# sourceMappingURL=layout.d.ts.map