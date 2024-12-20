import { RenderNodeWithMultiChildren } from '../../core/base.js';
import { Constraints } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetHStack extends RenderNodeWithMultiChildren {
    sizedByParent = true;
    performResize() {
        assert(this._constraints != null);
        this.size = this._constraints.biggest;
    }
    performLayout() {
        assert(this.size != null);
        assert(this._widgetFactory != null);
        let leftedWidth = this.size.w;
        this.visitChildren((child) => {
            child.layout(new Constraints({
                maxWidth: leftedWidth,
                maxHeight: this.size.h,
            }), { parentUsesSize: true, widgetFactory: this._widgetFactory });
            assert(child.size != null);
            leftedWidth -= child.size.w;
        });
        // offset
        let offsetX = 0;
        this.visitChildren(child => {
            let offsetY = (this.size.h - child.size.h) / 2; // 垂直方向居中
            child.offset = { x: offsetX, y: offsetY };
            offsetX += child.size.w;
        });
    }
    performCommit() { }
}
//# sourceMappingURL=hstack.js.map