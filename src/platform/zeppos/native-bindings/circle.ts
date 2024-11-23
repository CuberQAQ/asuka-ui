import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from'../../../core/base.js';
import { Size, Coordinate, Constraints } from'../../../core/layout.js';
import { assert } from'../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from'../../../tools/widget.js';
import { min } from'../../../tools/index.js';

type HmWidget = any;
const defaultProps = {
  color: 0xff8888,
};
export class NativeWidgetCircle extends RenderWidget {
  _widget: HmWidget | null = null;
  _preferredSizeManager = new PreferSizeManager(this);
  _props: Record<string, any> = { ...defaultProps };
  sizedByParent: boolean = false;
  _fromSizeAndPositionToProp(size: Size, position: Coordinate) {
    let radius = min(size.h, size.w) / 2;
    return {
      radius,
      center_x: position.x + size.w / 2 - radius,
      center_y: position.y + size.h / 2 - radius,
    };
  }
  onCommit({
    size,
    position,
    widgetFactory,
    initial,
  }: {
    size: Size;
    position: Coordinate;
    widgetFactory: WidgetFactory;
    initial?: boolean | undefined;
  }): void {
    if (initial) {
      assert(this._widget === null);
      this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, {
        ...this._props,
        ...this._fromSizeAndPositionToProp(size, position),
      });
    } else {
      assert(this._widget != null);
      this._widget!.setProperty(hmUI.prop.MORE, {
        ...this._props,
        ...this._fromSizeAndPositionToProp(size, position),
      });
    }
  }
  onDestroy(widgetFactory: WidgetFactory): void {
    assert(widgetFactory !== null && this._widget !== null);
    widgetFactory.deleteWidget(this._widget);
  }
  performResize(): void {
    assert(Constraints.isValid(this._constraints));
    this.size = this._constraints!.biggest;
  }
  performLayout(): void {
    this._preferredSizeManager.chooseSize();
    // assert(()=>{throw Error("Test Point 2")})
  }
  setProperty(key: string, value: any): void {
    super.setProperty(key, value);
    this._preferredSizeManager.setProperty(key, value);
    switch (key) {
      case 'r':
      case 'radius':
        {
          this._preferredSizeManager.setDefaultSize({w: value, h: value})
        }
        break;
      case 'color':
        {
          this._props.color = value;
          if (this._widget) this._widget.setProperty(hmUI.prop.COLOR, value);
        }
        break;
      case 'alpha':
        {
          this._props.alpha = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
    }
  }
}

export declare interface NativeWidgetCircleAttributes {
  r?: number;
  radius?: number;
  color?: number;
  alpha?: number;
}