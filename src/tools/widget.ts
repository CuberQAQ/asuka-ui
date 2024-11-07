import { Constraints, RenderNode, Size } from '../core/index.js';
import { assert } from '../debug/index.js';
import { max } from './math.js';

type NullableSize = { w: number | null; h: number | null };
export class PreferSizeManager {
  _preferredSize: NullableSize | null = null;
  constructor(public _node: RenderNode) {}
  _defaultSize: NullableSize | null = null;
  setDefaultSize(size: NullableSize | null) {
    this._defaultSize = size == null ? null : { ...size };
    let mixedSize = this._getMixedSize();
    if (!Size.equals(mixedSize, this._mixedSize)) {
      this._node.markNeedsLayout();
    }
    return this;
  }
  getDefaultSize(): NullableSize | null {
    return this._defaultSize;
  }
  _mixedSize: Size | null = null;
  _getMixedSize(): Size {
    return {
      w:
        this._preferredSize?.w ??
        this._defaultSize?.w ??
        Number.POSITIVE_INFINITY,
      h:
        this._preferredSize?.h ??
        this._defaultSize?.h ??
        Number.POSITIVE_INFINITY,
    };
  }
  /**
   * **根据已有属性选择最合适的尺寸**
   *
   * 请在`performLayout`中调用，本方法会将变化后的结果修改至宿主的`size`
   */
  chooseSize() {
    assert(this._node._constraints != null);
    assert(Constraints.isValid(this._node._constraints))
    this._mixedSize = this._getMixedSize();
    // assert(()=>{
    //   if(this._mixedSize?.h == null || this._mixedSize?.w == null){
    //     throw new Error(`PreferSizeManager.chooseSize() error: ${this._mixedSize?.h} ${this._mixedSize?.w}, at ${this._node.nodeName}`)
    //   }
    //   return true
    // })
    this._node.size = this._node._constraints!.constrain(this._mixedSize);
    
  }
  setProperty(key: string, value: any) {
    switch (key) {
      case 'w':
      case 'width':
        {
          let val = Number(value);
          if (!isNaN(val)) {
            val = max(val, 0);
            if (this._preferredSize === null || this._preferredSize.w !== val) {
              if (this._preferredSize === null) {
                this._preferredSize = { w: null, h: null };
              }
              this._preferredSize.w = val;
              this._node.markNeedsLayout();
            }
          }
        }
        break;
      case 'h':
      case 'height':
        {
          let val = Number(value);
          if (!isNaN(val)) {
            val = max(val, 0);
            if (this._preferredSize === null || this._preferredSize.h !== val) {
              if (this._preferredSize === null) {
                this._preferredSize = { w: null, h: null };
              }
              this._preferredSize.h = val;
              this._node.markNeedsLayout();
            }
          }
        }
        break;
    }
  }
}

export declare interface PreferSizeAttributesMixin {
  w?: number | null;
  h?: number | null;
  width?: number | null;
  height?: number | null;
}
