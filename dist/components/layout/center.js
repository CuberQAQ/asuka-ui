import { isRenderNode } from '../../core';
import { RenderNodeWithSingleChild, } from '../../core/base';
import { assert } from '../../debug/index';
export class LayoutWidgetCenter extends RenderNodeWithSingleChild {
    constructor() {
        super(...arguments);
        this.sizedByParent = true;
    }
    performResize() {
        assert(this._constraints != null);
        this.size = this._constraints.maxSize();
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
            child.offset = {
                x: (this.size.w - child.size.w) / 2,
                y: (this.size.h - child.size.h) / 2,
            };
        }
    }
    performCommit() { }
}
//# sourceMappingURL=center.js.map