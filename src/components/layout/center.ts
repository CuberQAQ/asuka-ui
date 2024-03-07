import { isRenderNode } from '../../core';
import {
  RenderNode,
  RenderNodeWithSingleChild,
} from '../../core/base';
import { assert } from '../../debug/index';

export class LayoutWidgetCenter extends RenderNodeWithSingleChild {
  sizedByParent: boolean = true;
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._constraints!.maxSize();
  }
  performLayout(): void {
    assert(this.size != null);
    assert(this._widgetFactory != null);
    assert(this._constraints != null);
    if (isRenderNode(this.child)) {
      let child = this.child as RenderNode;
      child.layout(this._constraints!.loose(), {
        parentUsesSize: true,
        widgetFactory: this._widgetFactory!,
      });
      assert(child.size != null);
      child.offset = {
        x: (this.size!.w - child.size!.w) / 2,
        y: (this.size!.h - child.size!.h) / 2,
      };
    }
  }
  performCommit(): void {}
}
