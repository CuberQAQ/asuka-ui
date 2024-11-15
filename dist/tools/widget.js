import { Constraints, Size } from '../core/index.js';
import { assert } from '../debug/index.js';
import { max } from './math.js';
export class PreferSizeManager {
    _node;
    _preferredSize = null;
    constructor(_node) {
        this._node = _node;
    }
    _defaultSize = null;
    setDefaultSize(size) {
        this._defaultSize = size == null ? null : { ...size };
        let mixedSize = this._getMixedSize();
        if (!Size.equals(mixedSize, this._mixedSize)) {
            this._node.markNeedsLayout();
        }
        return this;
    }
    getDefaultSize() {
        return this._defaultSize;
    }
    _mixedSize = null;
    _getMixedSize() {
        return {
            w: this._preferredSize?.w ??
                this._defaultSize?.w ??
                Number.POSITIVE_INFINITY,
            h: this._preferredSize?.h ??
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
        assert(Constraints.isValid(this._node._constraints));
        this._mixedSize = this._getMixedSize();
        // assert(()=>{
        //   if(this._mixedSize?.h == null || this._mixedSize?.w == null){
        //     throw new Error(`PreferSizeManager.chooseSize() error: ${this._mixedSize?.h} ${this._mixedSize?.w}, at ${this._node.nodeName}`)
        //   }
        //   return true
        // })
        this._node.size = this._node._constraints.constrain(this._mixedSize);
    }
    setProperty(key, value) {
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
//# sourceMappingURL=widget.js.map