import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget';

type HmWidget = any;
const defaultProps = {};
export class NativeWidgetImage extends RenderWidget {
  _widget: HmWidget | null = null;
  _props: Record<string, any> = { ...defaultProps };
  _preferredSizeManager: PreferSizeManager = new PreferSizeManager(this)
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
  performResize(): void {}
  performLayout(): void {}
  setProperty(key: string, value: any): void {
    switch (key) {
      case 'radius':
        {
          this._props.radius = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, { ...this._props });
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
            this._widget.setProperty(hmUI.prop.MORE, { ...this._props });
        }
        break;
    }
  }
}
