import { RenderNodeWithMultiChildren } from '../../core/base';
import { Constraints } from '../../core/layout';
import { assert } from '../../debug/index';

export class LayoutWidgetVStack extends RenderNodeWithMultiChildren {
  sizedByParent: boolean = true;
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._constraints!.maxSize();
  }
  performLayout(): void {
    assert(this.size != null);
    assert(this._widgetFactory != null);
    let leftedHeight = this.size!.h;
    this.visitChildren((child) => {
      child.layout(
        new Constraints({
          maxWidth: this.size!.w,
          maxHeight: leftedHeight,
        }),
        { parentUsesSize: true, widgetFactory: this._widgetFactory! },
      );
      assert(child.size != null);
      leftedHeight -= child.size!.h;
    });

    // offset
    let offsetY = 0
    this.visitChildren(child=>{
        let offsetX = (this.size!.w - child.size!.w) / 2 // 水平方向居中
        child.offset = {x: offsetX, y: offsetY}
        offsetY += child.size!.h
    })
  }
  performCommit(): void {}
}
