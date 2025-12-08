import { Constraints, isRenderNode, Size } from '../../core/index.js';
import { RenderNode, RenderNodeWithSingleChild } from '../../core/base.js';
import { assert } from '../../debug/index.js';

export class LayoutWidgetAspectRatio extends RenderNodeWithSingleChild {
  sizedByParent: boolean = true;
  _aspectRatio: number = 1.0;
  _applyAspectRatio(constraints: Constraints): Size {
    assert(
      !Number.isNaN(this._aspectRatio) &&
        this._aspectRatio > 0 &&
        this._aspectRatio < Number.POSITIVE_INFINITY,
    );
    assert(() => {
      if (
        this._constraints!.maxHeight === Number.POSITIVE_INFINITY &&
        this._constraints!.maxWidth === Number.POSITIVE_INFINITY
      ) {
        throw Error(
          "Aspect ratio can't be applied when both width and height are infinite",
        );
      }
      return true;
    });

    if (constraints.isTight) {
      return constraints.smallest;
    }

    let w = constraints.maxWidth;
    let h;

    // We default to picking the height based on the width, but if the width
    // would be infinite, that's not sensible so we try to infer the height
    // from the width.
    if (Number.isFinite(w)) {
      h = w / this._aspectRatio;
    } else {
      h = constraints.maxHeight;
      w = h * this._aspectRatio;
    }

    // Similar to RenderImage, we iteratively attempt to fit within the given
    // constraints while maintaining the given aspect ratio. The order of
    // applying the constraints is also biased towards inferring the height
    // from the width.

    if (w > constraints.maxWidth) {
      w = constraints.maxWidth;
      h = w / this._aspectRatio;
    }

    if (h > constraints.maxHeight) {
      h = constraints.maxHeight;
      w = h * this._aspectRatio;
    }

    if (w < constraints.minWidth) {
      w = constraints.minWidth;
      h = w / this._aspectRatio;
    }

    if (h < constraints.minHeight) {
      h = constraints.minHeight;
      w = h * this._aspectRatio;
    }

    return constraints.constrain({ w, h });
  }
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._applyAspectRatio(this._constraints!);
  }
  performLayout(): void {
    assert(this.size != null);
    assert(this._widgetFactory != null);
    assert(this._constraints != null);
    if (isRenderNode(this.child)) {
      let child = this.child as RenderNode;
      assert(this.size != null); // TODO test
      child.layout(Constraints.createTight(this.size!), {
        parentUsesSize: false,
        widgetFactory: this._widgetFactory!,
      });
      child.offset = {
        x: 0,
        y: 0,
      };
    }
  }
  performCommit(): void {}
  setProperty(key: string, value: any): void {
    super.setProperty(key, value);
    if (key === 'aspectRatio') {
      this._aspectRatio = value;
      this.markNeedsLayout();
    }
  }
}

export declare namespace LayoutWidgetAspectRatio {
  export interface Attributes extends RenderNodeWithSingleChild.Attributes {
    aspectRatio: number;
  }
}
