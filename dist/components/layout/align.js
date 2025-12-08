import { Alignment, isRenderNode } from '../../core/index.js';
import { RenderNodeWithSingleChild } from '../../core/base.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetAlign extends RenderNodeWithSingleChild {
    sizedByParent = true;
    _align = Alignment.center;
    _widthFactor = null;
    _heightFactor = null;
    performResize() {
        // only when sizedByParent (widthFactor == null && heightFactor == null)
        assert(this._constraints != null);
        this.size = this._constraints.biggest;
    }
    performLayout() {
        assert(this.size != null);
        assert(this._widgetFactory != null);
        assert(this._constraints != null);
        if (isRenderNode(this.child)) {
            let child = this.child;
            child.layout(this._constraints.loose(), {
                parentUsesSize: true,
                widgetFactory: this._widgetFactory,
            });
            assert(child.size != null);
            // when widthFactor or heightFactor is defined
            if (!this.sizedByParent) {
                this.size = this._constraints.biggest;
                if (this._widthFactor !== null) {
                    this.size.w = child.size.w * this._widthFactor;
                    if (this.size.w < this._constraints.minWidth) {
                        this.size.w = this._constraints.minWidth;
                    }
                    if (this.size.h < this._constraints.minHeight) {
                        this.size.h = this._constraints.minHeight;
                    }
                    // TODO
                    assert(this._constraints.testSize(this.size));
                }
                if (this._heightFactor !== null) {
                    this.size.h = child.size.h * this._heightFactor;
                }
            }
            child.offset = this._align.calcOffset(this.size, child.size);
        }
    }
    performCommit() { }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'x':
                {
                    let x = Number(value);
                    if (x !== this._align._x) {
                        this._align._x = x;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'y':
                {
                    let y = Number(value);
                    if (y !== this._align._y) {
                        this._align._y = y;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'alignment':
                {
                    if (!(value instanceof Alignment))
                        break;
                    if (value._x !== this._align._x || value._y !== this._align._y) {
                        this._align = Alignment.copy(value);
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'widthFactor':
                if (this._widthFactor !== value) {
                    this._widthFactor = value;
                    if (this.sizedByParent) {
                        this.sizedByParent = false;
                        this.markSizedByParentChanged();
                    }
                }
                break;
            case 'heightFactor':
                if (this._heightFactor !== value) {
                    this._heightFactor = value;
                    if (this.sizedByParent) {
                        this.sizedByParent = false;
                        this.markSizedByParentChanged();
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=align.js.map