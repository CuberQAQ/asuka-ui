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
    // TODO 处理 NaN 的情况
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
   * **约束操作**
   * @description
   * 将给定的Size对象以最小改动约束至该Constraints
   * @param size 需要约束的Size对象
   */
  constrain(size: Size) {
    if (size.width < this.minWidth) size.width = this.minWidth;
    else if (size.width > this.maxWidth) size.width = this.maxWidth;
    if (size.height < this.minHeight) size.height = this.minHeight;
    else if (size.height > this.maxHeight) size.height = this.maxHeight;
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
}

export class Size {
  static equals(size1: Size | null, size2: Size | null): boolean {
    if (size1 == null && size2 == null) return true;
    else if (size1 == null || size2 == null) return false;
    return size1.width === size2.width && size1.height === size2.height;
  }
  static isValid(size: Size | null) {
    // NaN>=0 -> false; 负无穷>=0 -> false; isFinite(正无穷) -> false.
    return (
      size != null &&
      size.height >= 0 &&
      size.width >= 0 &&
      isFinite(size.height) &&
      isFinite(size.width)
    );
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
      width: size1.width + size2.width,
      height: size1.height + size2.height,
    };
  }
}

export interface Size {
  width: number;
  height: number;
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
