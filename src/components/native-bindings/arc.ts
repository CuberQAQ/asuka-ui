import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget';

type HmWidget = any;
const defaultProps = {
  color: 0xcc0000,
  line_width: 5,
};
export class NativeWidgetArc extends RenderWidget {
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
      this._widget = widgetFactory.createWidget(hmUI.widget.ARC, {
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
    this._preferredSizeManager.setProperty(key, value);
    switch (key) {
      case 'color':
        {
          this._props.color = value;
          if (this._widget) this._widget.setProperty(hmUI.prop.COLOR, value);
        }
        break;
      case 's':
      case 'sa':
      case 'start':
      case 'start_angle':
        {
          this._props.start_angle = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.START_ANGLE, value);
        }
        break;
      case 'e':
      case 'ea':
      case 'end':
      case 'end_angle':
        {
          this._props.end_angle = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.END_ANGLE, value);
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

export declare interface NativeWidgetArcAttributes {
  color?: number,
  s?: number,
  sa?: number,
  start?: number,
  start_angle?: number,
  e?: number,
  ea?: number,
  end?: number,
  end_angle?: number,
  lw?: number,
  line_width?: number,
}