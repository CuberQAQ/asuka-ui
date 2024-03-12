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
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  constructor({
    minHeight = 0,
    maxHeight = Number.POSITIVE_INFINITY,
    minWidth = 0,
    maxWidth = Number.POSITIVE_INFINITY,
  }: {
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
  }) {
    if (isNaN(minHeight)) minHeight = 0;
    if (isNaN(minWidth)) minWidth = 0;
    if (isNaN(maxHeight)) maxHeight = 0;
    if (isNaN(maxWidth)) maxWidth = 0;
    if (minHeight < 0) minHeight = 0;
    if (minWidth < 0) minWidth = 0;
    if (maxHeight < minHeight) maxHeight = minHeight;
    if (maxWidth < minWidth) maxWidth = minWidth;
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
  static createTight(size: NullableSize) {
    return new Constraints({
      minWidth: size.w,
      maxWidth: size.w,
      minHeight: size.h,
      maxHeight: size.h,
    });
  }
  static isValid(constraints: Constraints | null) {
    return (
      constraints != null &&
      !(
        isNaN(constraints.minHeight) ||
        isNaN(constraints.minWidth) ||
        isNaN(constraints.maxHeight) ||
        isNaN(constraints.maxWidth)
      ) &&
      constraints.minHeight >= 0 &&
      constraints.minWidth >= 0 &&
      constraints.minHeight <= constraints.maxHeight &&
      constraints.minWidth <= constraints.maxWidth
    );
  }
  static copy(constraints: Constraints) {
    return new Constraints({
      minWidth: constraints.minWidth,
      maxWidth: constraints.maxWidth,
      minHeight: constraints.minHeight,
      maxHeight: constraints.maxHeight,
    });
  }
  copy(): Constraints {
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
  tighten({ width, height }: { width?: number; height?: number }) {
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
  constrain(size: Size) {
    if (size.w < this.minWidth) size.w = this.minWidth;
    else if (size.w > this.maxWidth) size.w = this.maxWidth;
    if (size.h < this.minHeight) size.h = this.minHeight;
    else if (size.h > this.maxHeight) size.h = this.maxHeight;
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
  adoptBy(constrain: Constraints) {
    assert(Constraints.isValid(constrain));
    if (this.minWidth < constrain.minWidth) this.minWidth = constrain.minWidth;
    else if (this.minWidth > constrain.maxWidth)
      this.minWidth = constrain.maxWidth;

    if (this.maxWidth > constrain.maxWidth) this.maxWidth = constrain.maxWidth;
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
  get biggest(): Size {
    return {
      w: this.maxWidth,
      h: this.maxHeight,
    };
  }
  /**
   * **返回符合该约束的最小尺寸**
   */
  get smallest(): Size {
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
  equals(other: Constraints | null) {
    return (
      other != null &&
      other.minHeight === this.minHeight &&
      other.maxHeight === this.maxHeight &&
      other.minWidth === this.minWidth &&
      other.maxWidth === this.maxWidth
    );
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
  testSize(size: Size): boolean {
    return (
      size.h >= this.minHeight &&
      size.h <= this.maxHeight &&
      size.w >= this.minWidth &&
      size.w <= this.maxWidth
    );
  }
}

export class Size {
  static equals(size1: Size | null, size2: Size | null): boolean {
    if (size1 == null && size2 == null) return true;
    else if (size1 == null || size2 == null) return false;
    return size1.w === size2.w && size1.h === size2.h;
  }
  static isValid(size: Size | null) {
    // NaN>=0 -> false; 负无穷>=0 -> false; isFinite(正无穷) -> false.
    return (
      size != null &&
      size.h >= 0 &&
      size.w >= 0 &&
      isFinite(size.h) &&
      isFinite(size.w)
    );
  }
  /**
   * **判断一个`Size`对象是不是有穷的**
   * @param size 要判断的`Size`对象
   * @returns 是否有穷
   */
  static isFinite(size: Size): boolean {
    return Number.isFinite(size.w) && Number.isFinite(size.h);
  }
  static copy(size: Size) {
    assert(size != null);
    return { ...size };
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
  static add(size1: Size, size2: Size): Size {
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
  static remove(size1: Size, size2: Size): Size {
    assert(size1 != null && size2 != null);
    return {
      w: size1.w - size2.w,
      h: size1.h - size2.h,
    };
  }
  static get infinite(): Size {
    return {
      w: Number.POSITIVE_INFINITY,
      h: Number.POSITIVE_INFINITY,
    };
  }
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

export class Coordinate {
  static copy(coord: Coordinate) {
    assert(coord != null);
    return { ...coord };
  }
  static isValid(coord: Coordinate | null) {
    // isFinite(NaN) -> false
    return coord != null && isFinite(coord.x) && isFinite(coord.y);
  }
  static origin(): Coordinate {
    return { x: 0, y: 0 };
  }
  static equals(coord1: Coordinate | null, coord2: Coordinate | null) {
    if (coord1 == null && coord2 == null) return true;
    else if (coord1 == null || coord2 == null) return false;
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
  static add(coord1: Coordinate, coord2: Coordinate): Coordinate {
    assert(coord1 != null && coord2 != null);
    return {
      x: coord1.x + coord2.x,
      y: coord1.y + coord2.y,
    };
  }
}

export class Alignment {
  _x: number = 0;
  _y: number = 0;
  /**
   * **创建对齐**
   * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
   * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
   */
  constructor(x?: number | null, y?: number | null) {
    if (x) {
      this._x = min(max(x!, -1.0), 1.0);
    }
    if (y) {
      this._y = min(max(y!, -1.0), 1.0);
    }
  }
  /**
   * **创建对齐**
   * @param x [-1.0,1.0] 当-1为最左 0为中 1为最右
   * @param y [-1.0,1.0] 当-1为最上 0为中 1为最下
   */
  static create(x?: number | null, y?: number | null) {
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
  calcOffset(parentSize: Size, childSize: Size): Coordinate {
    let emptySize = Size.remove(parentSize, childSize);
    return {
      x: (emptySize.w / 2) * (1.0 + this._x),
      y: (emptySize.h / 2) * (1.0 + this._y),
    };
  }
  static copy(alignment: Alignment) {
    return new Alignment(alignment._x, alignment._y);
  }
}

/**
 * **轴向**
 */
export enum Axis {
  /**
   * **水平**
   */
  horizontal,
  /**
   * **竖直**
   */
  vertical,
}

/**
 * 翻转轴向（水平变成垂直，垂直变成水平）
 * @param axis
 * @returns
 */
export function flipAxis(axis: Axis) {
  return axis === Axis.horizontal ? Axis.vertical : Axis.horizontal;
}

/**
 * **主轴对齐方式**
 */
export enum MainAxisAlignment {
  /**
   * **顶头**
   */
  start,
  /**
   * **接尾**
   */
  end,
  /**
   * **居中**
   */
  center,
  /**
   * **顶头**接尾，其他均分
   */
  spaceBetween,
  /**
   * **中间**的孩子均分,两头的孩子空一半
   */
  spaceAround,
  /**
   * **均匀**平分
   */
  spaceEvenly,
}

/**
 * **交叉对齐方式**
 */
export enum CrossAxisAlignment {
  /**
   * **顶头**
   */
  start,
  /**
   * **接尾**
   */
  end,
  /**
   * **居中**
   */
  center,
  /**
   * **伸展**
   */
  stretch,
  /**
   * **基线**
   */
  baseline,
}

/**
 * **主轴尺寸**
 */
export enum MainAxisSize {
  /**
   * **尽可能小**
   */
  min,
  /**
   * **尽可能大**
   */
  max,
}

/**
 * **水平排布方向**
 */
export enum HorizontalDirection {
  /**
   * **从左到右**
   */
  ltr,
  /**
   * **从右到左**
   */
  rtl,
}

/**
 * **竖直排布方向**
 */
export enum VerticalDirection {
  /**
   * **向上（从下到上）**
   */
  up,
  /**
   * **向下（从上到下）**
   */
  down,
}

/**
 * **文字基线**
 */
export enum TextBaseline {
  alphabetic,
  ideographic,
}

/**
 * **Flexible组件的尺寸适应方式**
 */
export enum FlexFit {
  /**
   * **强制子节点尺寸为可能的最大值**
   */
  tight,
  /**
   * **允许子节点尺寸在最大值以内自由选择**
   * @todo 这个到底是啥意思？
   */
  loose,
}

/**
 * **边距**
 */

export class EdgeInsets {
  _left: number;
  _up: number;
  _right: number;
  _down: number;
  constructor({
    left,
    up,
    right,
    down,
  }: {
    left: number;
    up: number;
    right: number;
    down: number;
  }) {
    this._left = left;
    this._up = up;
    this._right = right;
    this._down = down;
  }
  static all(value: number): EdgeInsets {
    return new EdgeInsets({
      left: value,
      up: value,
      right: value,
      down: value,
    });
  }
  static only(value?: {
    left?: number;
    up?: number;
    right?: number;
    down?: number;
  }): EdgeInsets {
    return new EdgeInsets({
      left: value?.left ?? 0,
      up: value?.up ?? 0,
      right: value?.right ?? 0,
      down: value?.down ?? 0,
    });
  }
  static symmetric({
    vertical,
    horizontal,
  }: {
    vertical: number;
    horizontal: number;
  }): EdgeInsets {
    return new EdgeInsets({
      left: horizontal,
      up: vertical,
      right: horizontal,
      down: vertical,
    });
  }
  static get zero() {
    return EdgeInsets.only();
  }
  equals(e: EdgeInsets | null): boolean {
    if (e == null) return false;
    return (
      this._left === e._left &&
      this._down === e._down &&
      this._right === e._right &&
      this._up === e._up
    );
  }
  get horizontalTotal() {
    return this._left + this._right;
  }
  get verticalTotal() {
    return this._up + this._down;
  }
  getInnerConstraints(outterConstraints: Constraints): Constraints {
    return new Constraints({
      minWidth: outterConstraints.minWidth - this.verticalTotal,
      maxWidth: outterConstraints.maxWidth - this.verticalTotal,
      minHeight: outterConstraints.minHeight - this.horizontalTotal,
      maxHeight: outterConstraints.maxHeight - this.horizontalTotal,
    });
  }
  /**
   * **获取仅包含padding占用空间的`Size`对象**
   */
  get totalSizeWithoutInner(): Size {
    return {
      w: this.horizontalTotal,
      h: this.verticalTotal,
    };
  }
  getOutterSize(innerSize: Size): Size {
    return {
      w: innerSize.w + this.horizontalTotal,
      h: innerSize.h + this.verticalTotal,
    };
  }
  get innerOffset(): Coordinate {
    return {
      x: this._left,
      y: this._up,
    };
  }
}

export enum StackFit {
  /**
   * 将Stack的约束宽松后传给子组件
   */
  loose,
  /**
   * 将Stack的约束严格化后传给子组件
   */
  expand,
  /**
   * 将Stack的约束原样传递给子组件
   */
  passthrough,
}
