// export interface ConstraintsData {
//   minHeight: number;
//   maxHeight: number;
//   minWidth: number;
//   maxWidth: number;
import { assert } from '../debug/index.js';
import { max, min } from '../tools/math.js';
// }
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
    static copy(constraints) {
        return new Constraints({
            minWidth: constraints.minWidth,
            maxWidth: constraints.maxWidth,
            minHeight: constraints.minHeight,
            maxHeight: constraints.maxHeight,
        });
    }
    copy() {
        return new Constraints({
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
        });
    }
    /**
     * 返回一个新的约束对象，使其在遵守原约束对象的同时尽可能向指定的长宽缩进
     * @param param0
     */
    tighten({ width, height }) {
        let constraints = this.copy();
        if (width !== undefined) {
            if (width > this.minWidth)
                constraints.minWidth = min(width, this.maxWidth);
            if (width < this.maxWidth)
                constraints.maxWidth = max(width, this.minWidth);
        }
        if (height !== undefined) {
            if (height > this.minHeight)
                constraints.minHeight = min(height, this.maxHeight);
            if (height < this.maxHeight)
                constraints.maxHeight = max(height, this.minHeight);
        }
        return constraints;
    }
    /**
     * **约束操作**
     * @description
     * 将给定的Size对象以最小改动约束至该Constraints
     *
     * **将直接修改源对象**
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
        return size;
    }
    /**
     * **适应操作**
     * @description
     * 将该Constraints通过最小改动符合给定的Constraints
     *
     * **将直接修改源对象**
     * @param size 需要约束的Size对象
     */
    adoptBy(constrain) {
        assert(Constraints.isValid(constrain));
        if (this.minWidth < constrain.minWidth)
            this.minWidth = constrain.minWidth;
        else if (this.minWidth > constrain.maxWidth)
            this.minWidth = constrain.maxWidth;
        if (this.maxWidth > constrain.maxWidth)
            this.maxWidth = constrain.maxWidth;
        else if (this.maxWidth < constrain.minWidth)
            this.maxWidth = constrain.minWidth;
        if (this.minHeight < constrain.minHeight)
            this.minHeight = constrain.minHeight;
        else if (this.minHeight > constrain.maxHeight)
            this.minHeight = constrain.maxHeight;
        if (this.maxHeight > constrain.maxHeight)
            this.maxHeight = constrain.maxHeight;
        else if (this.maxHeight < constrain.minHeight)
            this.maxHeight = constrain.minHeight;
        return this;
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
    get biggest() {
        return {
            w: this.maxWidth,
            h: this.maxHeight,
        };
    }
    /**
     * **返回符合该约束的最小尺寸**
     */
    get smallest() {
        return {
            w: this.minWidth,
            h: this.minHeight,
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
    toString() {
        return JSON.stringify({
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
        });
    }
    /**
     * **检测一个`Size`对象是否符合本约束要求**
     * @param size 要检测的`Size`对象
     */
    testSize(size) {
        return (size.h >= this.minHeight &&
            size.h <= this.maxHeight &&
            size.w >= this.minWidth &&
            size.w <= this.maxWidth);
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
    /**
     * **判断一个`Size`对象是不是有穷的**
     * @param size 要判断的`Size`对象
     * @returns 是否有穷
     */
    static isFinite(size) {
        return Number.isFinite(size.w) && Number.isFinite(size.h);
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
    /**
     * **分别相减两个`Size`对象的长和宽，并返回一个新对象.**
     *
     * 注意
     * - 传递空值会报错，但没判断是否合法.
     * @param size1
     * @param size2
     * @returns 累加后的新对象
     */
    static remove(size1, size2) {
        assert(size1 != null && size2 != null);
        return {
            w: size1.w - size2.w,
            h: size1.h - size2.h,
        };
    }
    static get infinite() {
        return {
            w: Number.POSITIVE_INFINITY,
            h: Number.POSITIVE_INFINITY,
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
export class Alignment {
    /**
     * **创建对齐**
     * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
     * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
     */
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        if (x) {
            this._x = min(max(x, -1.0), 1.0);
        }
        if (y) {
            this._y = min(max(y, -1.0), 1.0);
        }
    }
    /**
     * **创建对齐**
     * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
     * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
     */
    static create(x, y) {
        return new Alignment(x, y);
    }
    static get topLeft() {
        return new Alignment(-1.0, -1.0);
    }
    static get top() {
        return new Alignment(0.0, -1.0);
    }
    static get topRight() {
        return new Alignment(1.0, -1.0);
    }
    static get centerLeft() {
        return new Alignment(-1.0, 0.0);
    }
    static get center() {
        return new Alignment(0.0, 0.0);
    }
    static get centerRight() {
        return new Alignment(1.0, 0.0);
    }
    static get bottomLeft() {
        return new Alignment(-1.0, 1.0);
    }
    static get bottom() {
        return new Alignment(0.0, 1.0);
    }
    static get bottomRight() {
        return new Alignment(1.0, 1.0);
    }
    /**
     * **计算子偏移量**
     *
     * 根据两个尺寸（一个父一个子），计算子满足该`Alignment`对象时相对父的坐标坐标
     * @param parentSize 父尺寸
     * @param childSize 子尺寸
     * @returns 子相对父的偏移坐标
     * @todo 加上子大于父的判断
     */
    calcOffset(parentSize, childSize) {
        let emptySize = Size.remove(parentSize, childSize);
        return {
            x: (emptySize.w / 2) * (1.0 + this._x),
            y: (emptySize.h / 2) * (1.0 + this._y),
        };
    }
    static copy(alignment) {
        return new Alignment(alignment._x, alignment._y);
    }
}
/**
 * **轴向**
 */
export var Axis;
(function (Axis) {
    /**
     * **水平**
     */
    Axis[Axis["horizontal"] = 0] = "horizontal";
    /**
     * **竖直**
     */
    Axis[Axis["vertical"] = 1] = "vertical";
})(Axis || (Axis = {}));
/**
 * 翻转轴向（水平变成垂直，垂直变成水平）
 * @param axis
 * @returns
 */
export function flipAxis(axis) {
    return axis === Axis.horizontal ? Axis.vertical : Axis.horizontal;
}
/**
 * **主轴对齐方式**
 */
export var MainAxisAlignment;
(function (MainAxisAlignment) {
    /**
     * **顶头**
     */
    MainAxisAlignment[MainAxisAlignment["start"] = 0] = "start";
    /**
     * **接尾**
     */
    MainAxisAlignment[MainAxisAlignment["end"] = 1] = "end";
    /**
     * **居中**
     */
    MainAxisAlignment[MainAxisAlignment["center"] = 2] = "center";
    /**
     * **顶头**接尾，其他均分
     */
    MainAxisAlignment[MainAxisAlignment["spaceBetween"] = 3] = "spaceBetween";
    /**
     * **中间**的孩子均分,两头的孩子空一半
     */
    MainAxisAlignment[MainAxisAlignment["spaceAround"] = 4] = "spaceAround";
    /**
     * **均匀**平分
     */
    MainAxisAlignment[MainAxisAlignment["spaceEvenly"] = 5] = "spaceEvenly";
})(MainAxisAlignment || (MainAxisAlignment = {}));
/**
 * **交叉对齐方式**
 */
export var CrossAxisAlignment;
(function (CrossAxisAlignment) {
    /**
     * **顶头**
     */
    CrossAxisAlignment[CrossAxisAlignment["start"] = 0] = "start";
    /**
     * **接尾**
     */
    CrossAxisAlignment[CrossAxisAlignment["end"] = 1] = "end";
    /**
     * **居中**
     */
    CrossAxisAlignment[CrossAxisAlignment["center"] = 2] = "center";
    /**
     * **伸展**
     */
    CrossAxisAlignment[CrossAxisAlignment["stretch"] = 3] = "stretch";
    /**
     * **基线**
     */
    CrossAxisAlignment[CrossAxisAlignment["baseline"] = 4] = "baseline";
})(CrossAxisAlignment || (CrossAxisAlignment = {}));
/**
 * **主轴尺寸**
 */
export var MainAxisSize;
(function (MainAxisSize) {
    /**
     * **尽可能小**
     */
    MainAxisSize[MainAxisSize["min"] = 0] = "min";
    /**
     * **尽可能大**
     */
    MainAxisSize[MainAxisSize["max"] = 1] = "max";
})(MainAxisSize || (MainAxisSize = {}));
/**
 * **水平排布方向**
 */
export var HorizontalDirection;
(function (HorizontalDirection) {
    /**
     * **从左到右**
     */
    HorizontalDirection[HorizontalDirection["ltr"] = 0] = "ltr";
    /**
     * **从右到左**
     */
    HorizontalDirection[HorizontalDirection["rtl"] = 1] = "rtl";
})(HorizontalDirection || (HorizontalDirection = {}));
/**
 * **竖直排布方向**
 */
export var VerticalDirection;
(function (VerticalDirection) {
    /**
     * **向上（从下到上）**
     */
    VerticalDirection[VerticalDirection["up"] = 0] = "up";
    /**
     * **向下（从上到下）**
     */
    VerticalDirection[VerticalDirection["down"] = 1] = "down";
})(VerticalDirection || (VerticalDirection = {}));
/**
 * **文字基线**
 */
export var TextBaseline;
(function (TextBaseline) {
    TextBaseline[TextBaseline["alphabetic"] = 0] = "alphabetic";
    TextBaseline[TextBaseline["ideographic"] = 1] = "ideographic";
})(TextBaseline || (TextBaseline = {}));
/**
 * **Flexible组件的尺寸适应方式**
 */
export var FlexFit;
(function (FlexFit) {
    /**
     * **强制子节点尺寸为可能的最大值**
     */
    FlexFit[FlexFit["tight"] = 0] = "tight";
    /**
     * **允许子节点尺寸在最大值以内自由选择**
     * @todo 这个到底是啥意思？
     */
    FlexFit[FlexFit["loose"] = 1] = "loose";
})(FlexFit || (FlexFit = {}));
/**
 * **边距**
 */
export class EdgeInsets {
    constructor({ left, up, right, down, }) {
        this._left = left;
        this._up = up;
        this._right = right;
        this._down = down;
    }
    static all(value) {
        return new EdgeInsets({
            left: value,
            up: value,
            right: value,
            down: value,
        });
    }
    static only(value) {
        var _a, _b, _c, _d;
        return new EdgeInsets({
            left: (_a = value === null || value === void 0 ? void 0 : value.left) !== null && _a !== void 0 ? _a : 0,
            up: (_b = value === null || value === void 0 ? void 0 : value.up) !== null && _b !== void 0 ? _b : 0,
            right: (_c = value === null || value === void 0 ? void 0 : value.right) !== null && _c !== void 0 ? _c : 0,
            down: (_d = value === null || value === void 0 ? void 0 : value.down) !== null && _d !== void 0 ? _d : 0,
        });
    }
    static symmetric({ vertical, horizontal, }) {
        return new EdgeInsets({
            left: horizontal !== null && horizontal !== void 0 ? horizontal : 0,
            up: vertical !== null && vertical !== void 0 ? vertical : 0,
            right: horizontal !== null && horizontal !== void 0 ? horizontal : 0,
            down: vertical !== null && vertical !== void 0 ? vertical : 0,
        });
    }
    static get zero() {
        return EdgeInsets.only();
    }
    equals(e) {
        if (e == null)
            return false;
        return (this._left === e._left &&
            this._down === e._down &&
            this._right === e._right &&
            this._up === e._up);
    }
    get horizontalTotal() {
        return this._left + this._right;
    }
    get verticalTotal() {
        return this._up + this._down;
    }
    getInnerConstraints(outterConstraints) {
        return new Constraints({
            minWidth: outterConstraints.minWidth - this.horizontalTotal,
            maxWidth: outterConstraints.maxWidth - this.horizontalTotal,
            minHeight: outterConstraints.minHeight - this.verticalTotal,
            maxHeight: outterConstraints.maxHeight - this.verticalTotal,
        });
    }
    /**
     * **获取仅包含padding占用空间的`Size`对象**
     */
    get totalSizeWithoutInner() {
        return {
            w: this.horizontalTotal,
            h: this.verticalTotal,
        };
    }
    getOutterSize(innerSize) {
        return {
            w: innerSize.w + this.horizontalTotal,
            h: innerSize.h + this.verticalTotal,
        };
    }
    get innerOffset() {
        return {
            x: this._left,
            y: this._up,
        };
    }
}
export var StackFit;
(function (StackFit) {
    /**
     * 将Stack的约束宽松后传给子组件
     */
    StackFit[StackFit["loose"] = 0] = "loose";
    /**
     * 将Stack的约束严格化后传给子组件
     */
    StackFit[StackFit["expand"] = 1] = "expand";
    /**
     * 将Stack的约束原样传递给子组件
     */
    StackFit[StackFit["passthrough"] = 2] = "passthrough";
})(StackFit || (StackFit = {}));
//# sourceMappingURL=layout.js.map