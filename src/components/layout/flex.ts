import {
  RenderNodeWithMultiChildren,
  RenderNodeWithSingleChild,
} from '../../core/base';
import {
  Axis,
  Constraints,
  CrossAxisAlignment,
  FlexFit,
  HorizontalDirection,
  MainAxisAlignment,
  MainAxisSize,
  TextBaseline,
  VerticalDirection,
} from '../../core/layout';
import { assert } from '../../debug/index';

export class LayoutWidgetFlex extends RenderNodeWithMultiChildren {
  _direction: Axis = Axis.vertical;
  _mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.start;
  _mainAxisSize: MainAxisSize = MainAxisSize.max;
  _crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.center;
  _horizonDirection: HorizontalDirection = HorizontalDirection.ltr;
  _verticalDirection: VerticalDirection = VerticalDirection.down;
  _textBaseline: TextBaseline | null = null; // not support now
  sizedByParent: boolean = true;
  setProperty(key: string, value: any): void {
    switch (key) {
      case 'd':
      case 'direction':
        {
          if (value !== this._direction) {
            this._direction = value;
            this.markNeedsLayout();
          }
        }
        break;
      case 'maa':
      case 'mainAxisAlignment':
        {
          if (value !== this._mainAxisAlignment) {
            this._mainAxisAlignment = value;
            this.markNeedsLayout();
          }
        }
        break;
      case 'mas':
      case 'mainAxisSize':
        {
          if (value !== this._mainAxisSize) {
            this._mainAxisSize = value;
            if (this._mainAxisSize === MainAxisSize.max) {
              this.sizedByParent = true;
              this.markSizedByParentChanged();
            } else {
              this.sizedByParent = false;
              this.markSizedByParentChanged();
            }
            this.markNeedsLayout();
          }
        }
        break;
      case 'caa':
      case 'crossAxisAlignment':
        {
          if (value !== this._crossAxisAlignment) {
            this._crossAxisAlignment = value;
            this.markNeedsLayout();
          }
        }
        break;
      case 'hd':
      case 'horizonDirection':
        {
          if (value !== this._horizonDirection) {
            this._horizonDirection = value;
            this.markNeedsLayout();
          }
        }
        break;
      case 'vd':
      case 'verticalDirection':
        {
          if (value !== this._verticalDirection) {
            this._verticalDirection = value;
            this.markNeedsLayout();
          }
        }
        break;
      case 'tb':
      case 'textBaseline':
        {
          if (value !== this._textBaseline) {
            this._textBaseline = value;
            this.markNeedsLayout();
          }
        }
        break;
    }
  }
  /**
   * sizedByParent == true，即_mainAxisSize == MainAxisSize.max时的布局
   *
   * 直接maxSize就完事儿了
   */
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._constraints!.maxSize();
  }
  performLayout(): void {}
  performCommit(): void {}
}

export class LayoutWidgetFlexible extends RenderNodeWithSingleChild {
  _fit: FlexFit = FlexFit.loose;
  _flex: number = 1;
  onMount(): void {
    assert(() => {
      if (!(this.parentNode instanceof LayoutWidgetFlex)) {
        throw Error(
          'The Parent Node of a LayoutWidgetFlexible widget must be instance of LayoutWidgetFlex',
        );
      }
      return true;
    });
  }
  performResize(): void {}
  performLayout(): void {}
  performCommit(): void {}
  setProperty(key: string, value: any): void {}
}
