import { RenderNodeWithMultiChildren } from '../../core/base.js';
import { Constraints } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
import { timeit } from '../../decorator/debug.js';
export class LayoutWidgetVStack extends RenderNodeWithMultiChildren {
    gap = 0;
    sizedByParent = true;
    performResize() {
        assert(this._constraints != null);
        this.size = this._constraints.biggest;
    }
    @timeit()
    performLayout() {
        assert(this.size != null);
        assert(this._widgetFactory != null);
        let leftedHeight = this.size.h;
        this.visitChildren((child) => {
            child.layout(new Constraints({
                maxWidth: this.size.w,
                maxHeight: leftedHeight,
            }), { parentUsesSize: true, widgetFactory: this._widgetFactory });
            assert(child.size != null);
            leftedHeight -= child.size.h;
            leftedHeight -= this.gap;
        });
        // offset
        let offsetY = 0;
        this.visitChildren((child) => {
            let offsetX = (this.size.w - child.size.w) / 2; // 水平方向居中
            child.offset = { x: offsetX, y: offsetY };
            offsetY += child.size.h + this.gap;
        });
    }
    performCommit() { }
    setProperty(key, value) {
        if (key === 'gap') {
            this.gap = value;
            this.markNeedsLayout();
        }
    }
}
//# sourceMappingURL=vstack.js.map