import { Alignment, isRenderNode } from '../../core';
import { RenderNode, RenderNodeWithSingleChild } from '../../core/base';
import { assert } from '../../debug/index';

export class LayoutWidgetAlign extends RenderNodeWithSingleChild {
  sizedByParent: boolean = true;
  _align = Alignment.center;
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._constraints!.biggest;
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
      child.offset = this._align.calcOffset(this.size!, child.size!);
    }
  }
  performCommit(): void {}
  setProperty(key: string, value: any): void {
    super.setProperty(key, value)
    switch (key) {
      case 'x':
        {
          let x = Number(value);
          if (x !== this._align._x) {
            this._align._x = x;
            this.markNeedsLayout();
          }
        }
        break;
      case 'y':
        {
          let y = Number(value);
          if (y !== this._align._y) {
            this._align._y = y;
            this.markNeedsLayout();
          }
        }
        break;
      case 'alignment': {
        if (!(value instanceof Alignment)) break;
        if (value._x !== this._align._x || value._y !== this._align._y) {
          this._align = Alignment.copy(value);
          this.markNeedsLayout();
        }
      }
      break;
    }
  }
}
