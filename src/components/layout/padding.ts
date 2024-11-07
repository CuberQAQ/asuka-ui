import { EdgeInsets, isRenderNode } from '../../core/index.js';
import { RenderNode, RenderNodeWithSingleChild } from '../../core/base.js';
import { assert } from '../../debug/index.js';

export class LayoutWidgetPadding extends RenderNodeWithSingleChild {
  sizedByParent: boolean = false;
  _padding: EdgeInsets = EdgeInsets.zero;
  performResize(): void {}
  performLayout(): void {
    assert(this._constraints != null);
    assert(this._widgetFactory != null);
    if (isRenderNode(this.child)) {
      let child = this.child as RenderNode;
      let innerConstraints = this._padding.getInnerConstraints(
        this._constraints!,
      );
      child.layout(innerConstraints, {
        parentUsesSize: true,
        widgetFactory: this._widgetFactory!,
      });
      assert(child.size != null);
      let size = this._padding.getOutterSize(child.size!);
      assert(() => {
        if (!this._constraints!.testSize(size)) {
          throw new Error(
            `Padding out of bounds, size=${JSON.stringify(size)} constraints=${this._constraints?.toString()}`,
          );
        }
        return true;
      });
      this.size = size;
      child.offset = this._padding.innerOffset;
    } else {
      this.size = this._constraints!.constrain(
        this._padding.totalSizeWithoutInner,
      );
    }
  }
  performCommit(): void {}
  setProperty(key: string, value: unknown): void {
    super.setProperty(key, value);
    switch (key) {
      case 'p':
      case 'padding':
        {
          if (
            (value === null || value instanceof EdgeInsets) &&
            !this._padding.equals(value)
          ) {
            assert(value != null);
            this._padding = value!; // TODO copy object instead
            this.markNeedsLayout();
          }
        }
        break;
    }
  }
}

export declare namespace LayoutWidgetPadding {
  export interface Attributes extends RenderNodeWithSingleChild.Attributes {
    p?: EdgeInsets;
    padding?: EdgeInsets;
  }
}
