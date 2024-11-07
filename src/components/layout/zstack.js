import { Alignment, Constraints, RenderNodeProxy, RenderNodeWithMultiChildren, Size, StackFit, } from '../../core/index.js';
import { assert } from '../../debug/index.js';
import { max } from '../../tools/index.js';
export class LayoutWidgetZStack extends RenderNodeWithMultiChildren {
    constructor() {
        super(...arguments);
        this._align = Alignment.topLeft;
        this._fit = StackFit.loose;
    }
    _computeSize(constraints) {
        let hasNonPositionedChild = false;
        if (this._childRenderNodeCount === 0) {
            return Size.isFinite(constraints.biggest)
                ? constraints.biggest
                : constraints.smallest;
        }
        let width = constraints.minWidth;
        let height = constraints.minHeight;
        // Compute constraints for non-positioned child by _stackFit
        let nonPositionedConstraints;
        switch (this._fit) {
            case StackFit.loose:
                nonPositionedConstraints = constraints.loose();
                break;
            case StackFit.expand:
                nonPositionedConstraints = Constraints.createTight(constraints.biggest);
                break;
            case StackFit.passthrough:
                nonPositionedConstraints = constraints;
                break;
        }
        // Size all non-positioned children
        this.visitChildren((child) => {
            if (!(child instanceof LayoutWidgetPositioned)) {
                hasNonPositionedChild = true;
                child.layout(nonPositionedConstraints, {
                    parentUsesSize: true,
                    widgetFactory: this._widgetFactory,
                });
                assert(child.size != null);
                width = max(child.size.w, width);
                height = max(child.size.h, height);
            }
        });
        // Compute self size result and then return
        let size;
        if (hasNonPositionedChild) {
            size = { w: width, h: height };
            assert(Size.equals(size, constraints.constrain(size)));
        }
        else {
            size = constraints.biggest;
        }
        assert(Size.isFinite(size));
        return size;
    }
    _layoutPositionedChild(child) {
        assert(this.size != null);
        assert(this._widgetFactory != null);
        // Compute constraints for positioned child
        // If accurate size for child can be computed, use tighten constraints to make sure child obey that;
        // otherwise, use loosen constraints.
        let childConstraints = new Constraints({});
        if (child._left !== null && child._right !== null) {
            childConstraints = childConstraints.tighten({
                width: this.size.w - child._left - child._right,
            });
        }
        else if (child._width !== null) {
            childConstraints = childConstraints.tighten({ width: child._width });
        }
        if (child._top !== null && child._bottom !== null) {
            childConstraints = childConstraints.tighten({
                height: this.size.h - child._top - child._bottom,
            });
        }
        else if (child._height !== null) {
            childConstraints = childConstraints.tighten({ height: child._height });
        }
        child.layout(childConstraints, {
            parentUsesSize: true,
            widgetFactory: this._widgetFactory,
        });
        assert(child.size != null);
        // Calculate offset for positioned child.
        let x;
        if (child._left !== null) {
            x = child._left;
        }
        else if (child._right !== null) {
            x = this.size.w - child._right - child.size.w;
        }
        else {
            x = this._align.calcOffset(this.size, child.size).x;
        }
        let y;
        if (child._top !== null) {
            y = child._top;
        }
        else if (child._bottom !== null) {
            y = this.size.h - child._bottom - child.size.h;
        }
        else {
            y = this._align.calcOffset(this.size, child.size).y;
        }
        child.offset = { x, y };
    }
    performResize() { }
    performLayout() {
        assert(this._constraints != null);
        assert(this._widgetFactory != null);
        const constraints = this._constraints;
        this.size = this._computeSize(constraints);
        // Compute offset for all children while calculate size for positioned children
        this.visitChildren((child) => {
            if (child instanceof LayoutWidgetPositioned) {
                // Can not specify the three options at the same time (because they may have conflict)
                assert(child._left === null ||
                    child._right === null ||
                    child._width === null);
                assert(child._top === null ||
                    child._bottom === null ||
                    child._height === null);
                this._layoutPositionedChild(child);
            }
            else {
                assert(child.size != null);
                child.offset = this._align.calcOffset(this.size, child.size);
            }
        });
    }
    performCommit() { }
    setProperty(key, value) {
        switch (key) {
            case 'ali':
            case 'align':
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
            case 'fit':
                {
                    if (value !== this._fit) {
                        this._fit = value;
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
}
export class LayoutWidgetPositioned extends RenderNodeProxy {
    constructor() {
        super(...arguments);
        this._left = null;
        this._right = null;
        this._top = null;
        this._bottom = null;
        this._width = null;
        this._height = null;
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'l':
            case 'x':
            case 'left':
                {
                    if (value !== this._left) {
                        this._left = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'r':
            case 'right':
                {
                    if (value !== this._left) {
                        this._right = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 't':
            case 'y':
            case 'top':
            case 'up':
                {
                    if (value !== this._top) {
                        this._top = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'b':
            case 'bottom':
            case 'down':
                {
                    if (value !== this._bottom) {
                        this._bottom = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'w':
            case 'width':
                {
                    if (value !== this._width) {
                        this._width = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'h':
            case 'height':
                {
                    if (value !== this._height) {
                        this._height = value;
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=zstack.js.map