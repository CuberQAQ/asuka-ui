import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from'../../../core/base.js';
import { Size, Coordinate, Constraints } from'../../../core/layout.js';
import { assert } from'../../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from'../../../tools/widget.js';
import { LiteWidget, LiteWidgetAttributes } from './lite-widget.js';

type HmWidget = any;
const defaultProps = {
  content: 'null',
};
// Not support bg_x bg_y bg_w bg_h, please use container or stack etc to add background decoration.
export class LiteWidgetQRCode extends LiteWidget {
  _widget: HmWidget | null = null;
  _props: Record<string, any> = { ...defaultProps };
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
      this._widget = widgetFactory.createWidget((hmUI.widget as any).QRCODE, {
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
      case 'content':
        {
          this._props.content = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.position,
              ...this.size,
              content: value,
            });
        }
        break;
    }
  }
}

export declare interface LiteWidgetQRCodeAttributes extends LiteWidgetAttributes {
  content: string;
}