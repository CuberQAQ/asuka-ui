import { Constraints, isRenderNode } from '../../core';
import { RenderNode, RenderNodeWithSingleChild } from '../../core/base';
import { assert } from '../../debug/index';
export class LayoutWidgetSizedBox extends RenderNodeWithSingleChild {
  protected _width: number | null = null;
  protected _height: number | null = null;
  _generateChildConstraints(): Constraints {
    assert(this._constraints != null);
    return Constraints.createTight({
      w: this._width ?? Number.POSITIVE_INFINITY,
      h: this._height ?? Number.POSITIVE_INFINITY,
    }).adoptBy(this._constraints!);
  }
  performResize(): void {}
  performLayout(): void {
    // assert(this.size != null);
    assert(this._widgetFactory != null);
    assert(this._constraints != null);
    if (isRenderNode(this.child)) {
      let child = this.child as RenderNode;
      let constraints = this._generateChildConstraints();
      assert(() => {
        if(!constraints.isTight) {
            throw Error(`constraints.isTight == false constraints=${constraints.toString()}`)
        }
        return true
      });
      child.layout(constraints, {
        parentUsesSize: false,
        widgetFactory: this._widgetFactory!,
      });
      this.size = constraints.maxSize();
      child.offset = {
        x: 0,
        y: 0,
      };
    }
  }
  performCommit(): void {}
  setProperty(key: string, value: any): void {
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
