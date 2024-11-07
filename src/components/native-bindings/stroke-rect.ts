import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base.js';
import { Size, Coordinate, Constraints } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget.js';

type HmWidget = any;
const defaultProps = {
  color: 0xcc4400,
};
export class NativeWidgetStrokeRect extends RenderWidget {
  _widget: HmWidget | null = null;
  _preferredSizeManager = new PreferSizeManager(this);
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
      this._widget = widgetFactory.createWidget(hmUI.widget.STROKE_RECT, {
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
    }
  }
}

export declare interface NativeWidgetStrokeRectAttributes {
  r?: number;
  radius?: number;
  color?: number;
  lw?: number;
  line_width?: number;
  angle?: number;
}