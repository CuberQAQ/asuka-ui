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
  _preferredSizeManager: PreferSizeManager = new PreferSizeManager(this);
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
  _updateDefaultSize() {
    if (this._props.src) {
      let { width, height } = (hmUI as any).getImageInfo(this._props.src);
      this._preferredSizeManager.setDefaultSize({ w: width, h: height });
    }
  }
  setProperty(key: string, value: any): void {
    super.setProperty(key, value);
    this._preferredSizeManager.setProperty(key, value);
    switch (key) {
      case 'color':
        if (value !== this._props.color) {
          this._props.color = value;
          if (this._widget) this._widget.setProperty(hmUI.prop.COLOR, value);
        }
        break;
      // case 'alpha':
      //   {
      //     if (value !== this._props.alpha) {
      //       this._props.alpha = value;
      //       if (this._widget)
      //         this._widget.setProperty(hmUI.prop.MORE, { ...this._props });
      //     }
      //   }
      //   break;
      case 'pos_x':
        {
          if (value !== this._props.pos_x) {
            this._props.pos_x = value;
            if (this._widget) this._widget.setProperty(hmUI.prop.POS_X, value);
          }
        }
        break;
      case 'pos_y':
        {
          if (value !== this._props.pos_y) {
            this._props.pos_y = value;
            if (this._widget) this._widget.setProperty(hmUI.prop.POS_Y, value);
          }
        }
        break;
      case 'angle':
        {
          if (value !== this._props.angle) {
            this._props.angle = value;
            if (this._widget) this._widget.setProperty(hmUI.prop.ANGLE, value);
          }
        }
        break;
      case 'center_x':
        {
          if (value !== this._props.center_x) {
            this._props.center_x = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.CENTER_X, value);
          }
        }
        break;
      case 'center_y':
        {
          if (value !== this._props.center_y) {
            this._props.center_y = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.CENTER_Y, value);
          }
        }
        break;
      case 'alpha':
        {
          if (value !== this._props.alpha) {
            this._props.alpha = value;
            if (this._widget)
              this._widget.setProperty((hmUI.prop as any).ALPHA, value);
          }
        }
        break;
      case 'auto_scale':
        {
          if (value !== this._props.auto_scale) {
            this._props.auto_scale = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this._props,
              });
          }
        }
        break;
      case 'auto_scale_obj_fit':
        {
          if (value !== this._props.auto_scale_obj_fit) {
            this._props.auto_scale_obj_fit = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this._props,
              });
          }
        }
        break;
      case 'src':
        {
          if (value !== this._props.src) {
            this._props.src = value;
            if (this._widget) this._widget.setProperty(hmUI.prop.SRC, value);
          }
        }
        break;
    }
  }
}

export declare interface NativeWidgetImageAttributes {
  color: string;
  alpha: number;
  pos_x: number;
  pos_y: number;
  angle: number;
  center_x: number;
  center_y: number;
  auto_scale: boolean;
  auto_scale_obj_fit: string;
  src: string;
}