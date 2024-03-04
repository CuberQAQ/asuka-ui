// export interface ConstraintsData {
//   minHeight: number;
//   maxHeight: number;
//   minWidth: number;
//   maxWidth: number;
// }

/**
 * **布局约束类**
 * @description
 * 保存了布局时长宽分别允许的范围。在布局时，由父节点至子节点向下逐层传递
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


export interface Size {
  width: number;
  height: number;
}
