import { EdgeInsets, isRenderNode } from '../../core/index.js';
import { RenderNodeWithSingleChild } from '../../core/base.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetPadding extends RenderNodeWithSingleChild {
    constructor() {
        super(...arguments);
        this.sizedByParent = false;
        this._padding = EdgeInsets.zero;
    }
    performResize() { }
    performLayout() {
        assert(this._constraints != null);
        assert(this._widgetFactory != null);
        if (isRenderNode(this.child)) {
            let child = this.child;
            let innerConstraints = this._padding.getInnerConstraints(this._constraints);
            child.layout(innerConstraints, {
                parentUsesSize: true,
                widgetFactory: this._widgetFactory,
            });
            assert(child.size != null);
            let size = this._padding.getOutterSize(child.size);
            assert(() => {
                var _a;
                if (!this._constraints.testSize(size)) {
                    throw new Error(`Padding out of bounds, size=${JSON.stringify(size)} constraints=${(_a = this._constraints) === null || _a === void 0 ? void 0 : _a.toString()}`);
                }
                return true;
            });
            this.size = size;
            child.offset = this._padding.innerOffset;
        }
        else {
            this.size = this._constraints.constrain(this._padding.totalSizeWithoutInner);
        }
    }
    performCommit() { }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'p':
            case 'padding':
                {
                    if ((value === null || value instanceof EdgeInsets) &&
                        !this._padding.equals(value)) {
                        assert(value != null);
                        this._padding = value; // TODO copy object instead
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=padding.js.map