import { Constraints, isRenderNode } from '../../core/index.js';
import {
  RenderNode,
  RenderNodeProxy,
  RenderNodeWithSingleChild,
} from '../../core/base.js';
import { assert } from '../../debug/index.js';
export class LayoutWidgetConstrainedBox extends RenderNodeWithSingleChild {
  _additionalConstrains: Constraints | null = null;
  performResize(): void {}
  performLayout(): void {
    // assert(this.size != null);
    assert(this._widgetFactory != null);
    assert(this._constraints != null);
    assert(() => {
      if (!this._additionalConstrains) {
        throw Error(
          '"constrains" property of LayoutWidgetConstrainedBox must not be null',
        );
      }
      return true;
    });
    let constraints = this._additionalConstrains!.adoptBy(this._constraints!);
    if (isRenderNode(this.child)) {
      let child = this.child as RenderNode;
      child.layout(constraints, {
        parentUsesSize: true,
        widgetFactory: this._widgetFactory!,
      });
      this.size = child.size;
      child.offset = {
        x: 0,
        y: 0,
      };
    } else {
      this.size = constraints.smallest;
    }
  }
  performCommit(): void {}
  setProperty(key: string, value: any): void {
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

export declare namespace LayoutWidgetConstrainedBox {
  export interface Attributes extends RenderNodeWithSingleChild.Attributes {
    constraints: Constraints;
  }
}
