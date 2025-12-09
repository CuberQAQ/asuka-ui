import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from'../../../core/base.js';
import { Size, Coordinate, Constraints } from'../../../core/layout.js';
import { assert } from'../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from'../../../tools/widget.js';
import { LiteWidget, LiteWidgetAttributes } from './lite-widget.js';

type HmWidget = any;
const defaultProps = {};
export class LiteWidgetPolyline extends LiteWidget {
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
      this._widget = widgetFactory.createWidget(
        (hmUI.widget as any).GRADKIENT_POLYLINE,
        {
          ...this._props,
          ...position,
          ...size,
        },
      );
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
      case 'color':
      case 'line_color':
        {
          this._props.line_color = value;
          if (this._widget)
            this._widget.setProperty((hmUI.prop as any).LINE_COLOR, value);
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
    }
  }
}

export declare interface LiteWidgetPolylineAttributes extends LiteWidgetAttributes {
  color?: string;
  line_color?: string;
  lw?: number;
  line_width?: number;
}