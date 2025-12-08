import { isRenderNode } from '../../core/index.js';
import { RenderNodeWithSingleChild, } from '../../core/base.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetConstrainedBox extends RenderNodeWithSingleChild {
    _additionalConstrains = null;
    performResize() { }
    performLayout() {
        // assert(this.size != null);
        assert(this._widgetFactory != null);
        assert(this._constraints != null);
        assert(() => {
            if (!this._additionalConstrains) {
                throw Error('"constrains" property of LayoutWidgetConstrainedBox must not be null');
            }
            return true;
        });
        let constraints = this._additionalConstrains.adoptBy(this._constraints);
        if (isRenderNode(this.child)) {
            let child = this.child;
            child.layout(constraints, {
                parentUsesSize: true,
                widgetFactory: this._widgetFactory,
            });
            this.size = child.size;
            child.offset = {
                x: 0,
                y: 0,
            };
        }
        else {
            this.size = constraints.smallest;
        }
    }
    performCommit() { }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'constraints':
                {
                    this._additionalConstrains = value;
                    this.markNeedsLayout();
                }
                break;
        }
    }
}
//# sourceMappingURL=constrained-box.js.map