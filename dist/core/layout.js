// export interface ConstraintsData {
//   minHeight: number;
//   maxHeight: number;
//   minWidth: number;
//   maxWidth: number;
// }
import { assert } from '../debug/index';
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
export class Constraints {
    constructor({ minHeight = 0, maxHeight = Number.POSITIVE_INFINITY, minWidth = 0, maxWidth = Number.POSITIVE_INFINITY, }) {
        if (isNaN(minHeight))
            minHeight = 0;
        if (isNaN(minWidth))
            minWidth = 0;
        if (isNaN(maxHeight))
            maxHeight = 0;
        if (isNaN(maxWidth))
            maxWidth = 0;
        if (minHeight < 0)
            minHeight = 0;
        if (minWidth < 0)
            minWidth = 0;
        if (maxHeight < minHeight)
            maxHeight = minHeight;
        if (maxWidth < minWidth)
            maxWidth = minWidth;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
    }
    /**
     * **创建一个严格约束**
     * @description 给定一个`Size`对象，返回一个`Constraints`对象，
     * 使得满足该`Constraints`约束的`Size`仅有给定的`Size`一种
     * @param size
     * @returns
     */
    static createTight(size) {
        return new Constraints({
            minWidth: size.w,
            maxWidth: size.w,
            minHeight: size.h,
            maxHeight: size.h,
        });
    }
    static isValid(constraints) {
        return (constraints != null &&
            !(isNaN(constraints.minHeight) ||
                isNaN(constraints.minWidth) ||
                isNaN(constraints.maxHeight) ||
                isNaN(constraints.maxWidth)) &&
            constraints.minHeight >= 0 &&
            constraints.minWidth >= 0 &&
            constraints.minHeight <= constraints.maxHeight &&
            constraints.minWidth <= constraints.maxWidth);
    }
    /**
     * **约束操作**
     * @description
     * 将给定的Size对象以最小改动约束至该Constraints
     * @param size 需要约束的Size对象
     */
    constrain(size) {
        if (size.w < this.minWidth)
            size.w = this.minWidth;
        else if (size.w > this.maxWidth)
            size.w = this.maxWidth;
        if (size.h < this.minHeight)
            size.h = this.minHeight;
        else if (size.h > this.maxHeight)
            size.h = this.maxHeight;
    }
    /**
     * **宽松化**
     * @description
     * 将`minHeight`和`minWidth`的限制去除（设为0），返回一个新Constrains对象，不会改变原Constrains对象
     * @returns 宽松化后的Constrains对象
     */
    loose() {
        return new Constraints({
            maxHeight: this.maxHeight,
            maxWidth: this.maxWidth,
        });
    }
    /**
     * **返回符合该约束的最大尺寸**
     */
    maxSize() {
        return {
            w: this.maxWidth,
            h: this.maxHeight,
        };
    }
    /**
     * **是否为严格约束**
     * @description
     * 即`minHeight`与`maxHeight`是否相等，且`minWidth`与`maxWidth`是否相等
     */
    get isTight() {
        return this.minHeight === this.maxHeight && this.minWidth === this.maxWidth;
    }
    /**
     * **判断两个Constrains对象是否相等**
     * @description
     * 当两个Constrains对象的`minHeight`、`maxHeight`、`minWidth`、`maxWidth`均相等时，返回true，否则为false
     * @param other 另一个Constrains对象
     * @returns 两个Constraints是否相等（当other参数为null时始终返回false）
     */
    equals(other) {
        return (other != null &&
            other.minHeight === this.minHeight &&
            other.maxHeight === this.maxHeight &&
            other.minWidth === this.minWidth &&
            other.maxWidth === this.maxWidth);
    }
}
export class Size {
    static equals(size1, size2) {
        if (size1 == null && size2 == null)
            return true;
        else if (size1 == null || size2 == null)
            return false;
        return size1.w === size2.w && size1.h === size2.h;
    }
    static isValid(size) {
        // NaN>=0 -> false; 负无穷>=0 -> false; isFinite(正无穷) -> false.
        return (size != null &&
            size.h >= 0 &&
            size.w >= 0 &&
            isFinite(size.h) &&
            isFinite(size.w));
    }
    static copy(size) {
        assert(size != null);
        return Object.assign({}, size);
    }
    /**
     * **分别相加两个`Size`对象的长和宽，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param size1
     * @param size2
     * @returns 累加后的新对象
     */
    static add(size1, size2) {
        assert(size1 != null && size2 != null);
        return {
            w: size1.w + size2.w,
            h: size1.h + size2.h,
        };
    }
}
export class Coordinate {
    static copy(coord) {
        assert(coord != null);
        return Object.assign({}, coord);
    }
    static isValid(coord) {
        // isFinite(NaN) -> false
        return coord != null && isFinite(coord.x) && isFinite(coord.y);
    }
    static origin() {
        return { x: 0, y: 0 };
    }
    static equals(coord1, coord2) {
        if (coord1 == null && coord2 == null)
            return true;
        else if (coord1 == null || coord2 == null)
            return false;
        return coord1.x === coord2.x && coord1.y === coord2.y;
    }
    /**
     * **分别相加两个`Coordinate`对象的`x`和`y`，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param coord1
     * @param coord2
     * @returns 累加后的新对象
     */
    static add(coord1, coord2) {
        assert(coord1 != null && coord2 != null);
        return {
            x: coord1.x + coord2.x,
            y: coord1.y + coord2.y,
        };
    }
}
//# sourceMappingURL=layout.js.map