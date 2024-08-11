import { Size } from '../core';
import { assert } from '../debug';
import { max } from './math';
export class PreferSizeManager {
    constructor(_node) {
        this._node = _node;
        this._preferredSize = null;
        this._defaultSize = null;
        this._mixedSize = null;
    }
    setDefaultSize(size) {
        this._defaultSize = size == null ? null : Object.assign({}, size);
        let mixedSize = this._getMixedSize();
        if (!Size.equals(mixedSize, this._mixedSize)) {
            this._node.markNeedsLayout();
        }
        return this;
    }
    getDefaultSize() {
        return this._defaultSize;
    }
    _getMixedSize() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            w: (_d = (_b = (_a = this._preferredSize) === null || _a === void 0 ? void 0 : _a.w) !== null && _b !== void 0 ? _b : (_c = this._defaultSize) === null || _c === void 0 ? void 0 : _c.w) !== null && _d !== void 0 ? _d : Number.POSITIVE_INFINITY,
            h: (_h = (_f = (_e = this._preferredSize) === null || _e === void 0 ? void 0 : _e.h) !== null && _f !== void 0 ? _f : (_g = this._defaultSize) === null || _g === void 0 ? void 0 : _g.h) !== null && _h !== void 0 ? _h : Number.POSITIVE_INFINITY,
        };
    }
    /**
     * **根据已有属性选择最合适的尺寸**
     *
     * 请在`performLayout`中调用，本方法会将变化后的结果修改至宿主的`size`
     */
    chooseSize() {
        assert(this._node._constraints != null);
        this._mixedSize = this._getMixedSize();
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