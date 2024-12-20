import { Constraints, isRenderNode } from '../../core/index.js';
import { RenderNodeWithSingleChild } from '../../core/base.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetSizedBox extends RenderNodeWithSingleChild {
    _width = null;
    _height = null;
    _generateChildConstraints() {
        assert(this._constraints != null);
        return Constraints.createTight({
            w: this._width ?? Number.POSITIVE_INFINITY,
            h: this._height ?? Number.POSITIVE_INFINITY,
        }).adoptBy(this._constraints);
    }
    performResize() { }
    performLayout() {
        // assert(this.size != null);
        assert(this._widgetFactory != null);
        assert(this._constraints != null);
        let constraints = this._generateChildConstraints();
        if (isRenderNode(this.child)) {
            let child = this.child;
            assert(() => {
                if (!constraints.isTight) {
                    throw Error(`constraints.isTight == false constraints=${constraints.toString()}`);
                }
                return true;
            });
            child.layout(constraints, {
                parentUsesSize: false,
                widgetFactory: this._widgetFactory,
            });
            child.offset = {
                x: 0,
                y: 0,
            };
        }
        this.size = constraints.biggest;
    }
    performCommit() { }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'width':
            case 'w':
                {
                    let w = Number(value);
                    if (w !== this._width) {
                        this._width = w;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'height':
            case 'h':
                {
                    let h = Number(value);
                    if (h !== this._height) {
                        this._height = h;
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=sizedbox.js.map