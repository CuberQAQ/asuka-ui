import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../../core/base.js';
import { Size, Coordinate, Constraints } from '../../../core/layout.js';
import { assert } from '../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../../tools/widget.js';
import { LiteWidget, LiteWidgetAttributes } from './lite-widget.js';

type HmWidget = any;
const defaultProps = {
  color: 0xcc4400,
};
export class LiteWidgetStrokeRect extends LiteWidget {
  _widget: HmWidget | null = null;
  _props: Record<string, any> = { ...defaultProps };
  _alpha: number = 255;
  sizedByParent: boolean = false;
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
      this._widget = widgetFactory.createWidget(hmUI.widget.STROKE_RECT, {
        ...this._props,
        ...position,
        ...size,
      });
      if (this._alpha !== 255) {
        this._widget?.setAlpha(this._alpha);
      }
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
      case 'angle':
        {
          this._props.angle = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
      case 'lw':
      case 'line_width':
        {
          this._props.line_width = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.LINE_WIDTH, value);
        }
        break;
      case 'alpha':
        {
          if (this._alpha !== value) {
            this._alpha = value;
            if (this._widget) this._widget.setAlpha(value);
          }
        }
        break;
    }
  }
}

export declare interface LiteWidgetStrokeRectAttributes
  extends LiteWidgetAttributes {
  r?: number;
  radius?: number;
  color?: number;
  lw?: number;
  line_width?: number;
  angle?: number;
  alpha?: number;
}
