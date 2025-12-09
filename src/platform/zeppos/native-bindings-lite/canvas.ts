import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../../core/base.js';
import { Size, Coordinate, Constraints } from '../../../core/layout.js';
import { assert } from '../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../../tools/widget.js';
import { LiteWidget, LiteWidgetAttributes } from './lite-widget.js';

type HmWidget = any;
const defaultProps = {};
export class LiteWidgetCanvas extends LiteWidget {
  _widget: HmWidget | null = null;
  // _preferredSizeManager = new PreferSizeManager(this);
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
      this._widget = widgetFactory.createWidget((hmUI.widget as any).CANVAS, {
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
}

export declare interface LiteWidgetCanvasAttributes
  extends LiteWidgetAttributes {};
