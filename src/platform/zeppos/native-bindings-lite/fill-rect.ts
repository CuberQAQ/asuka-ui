import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from'../../../core/base.js';
import { Size, Coordinate, Constraints } from'../../../core/layout.js';
import { assert } from'../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from'../../../tools/widget.js';
import { LiteWidget, LiteWidgetAttributes } from './lite-widget.js';

type HmWidget = any;
const defaultProps = {
  color: 0xcc0000,
};
export class LiteWidgetFillRect extends LiteWidget {
  _widget: HmWidget | null = null;
  _props: Record<string, any> = { ...defaultProps };
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
        ...position,
        ...size,
      });
    } else {
      assert(this._widget != null);
      this._widget!.setProperty(hmUI.prop.MORE, {
        ...this._props,
        ...position,
        ...size,
      });
    }
  }
  onDestroy(widgetFactory: WidgetFactory): void {
    assert(widgetFactory !== null && this._widget !== null);
    widgetFactory.deleteWidget(this._widget);
  }
  setProperty(key: string, value: any): void {
    super.setProperty(key, value);
    switch (key) {
      case 'r':
        case 'radius':
        {
          this._props.radius = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
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

export declare interface LiteWidgetFillRectAttributes extends LiteWidgetAttributes {
  r?: number
  radius?: number
  color?: number
  alpha?: number
}