import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget';

type HmWidget = any;
const defaultProps = {};
export class NativeWidgetButton extends RenderWidget {
  _widget: HmWidget | null = null;
  _preferredSizeManager = new PreferSizeManager(this).setDefaultSize(
    Size.infinite,
  );
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
      this._widget = widgetFactory.createWidget(hmUI.widget.BUTTON, {
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
  _updateDefaultSize() {
    if (this._props.normal_src) {
      let { width, height } = (hmUI as any).getImageInfo(
        this._props.normal_src,
      );
      this._preferredSizeManager.setDefaultSize({ w: width, h: height });
    }
  }
  setProperty(key: string, value: any): void {
    this._preferredSizeManager.setProperty(key, value);
    switch (key) {
      case 'text':
        {
          if (this._props.text !== value) {
            this._props.text = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this.size,
                ...this.position,
                text: value,
              });
          }
        }
        break;
      case 'color':
        {
          if (this._props.color !== value) {
            this._props.color = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this.size,
                ...this.position,
                color: value,
              });
          }
        }
        break;
      case 'size':
      case 'ts':
      case 'text_size':
        {
          if (this._props.text_size !== value) {
            this._props.text_size = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this.size,
                ...this.position,
                text_size: value,
              });
          }
        }
        break;
      case 'nc':
      case 'ncolor':
      case 'normal_color':
        {
          if (this._props.normal_color !== value) {
            this._props.normal_color = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this.size,
                ...this.position,
                normal_color: value,
              });
          }
        }
        break;
      case 'pc':
      case 'pcolor':
      case 'press_color': {
        if (this._props.press_color !== value) {
          this._props.press_color = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              press_color: value,
            });
        }
      }
      case 'r':
      case 'radius': {
        if (this._props.radius !== value) {
          this._props.radius = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              radius: value,
            });
        }
      }
      case 'ns':
      case 'nsrc':
      case 'normal_src': {
        if (this._props.normal_src !== value) {
          this._props.normal_src = value;
          this._updateDefaultSize();
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              normal_src: value,
            });
        }
      }
      case 'ps':
      case 'psrc':
      case 'press_src':
        {
          if (this._props.press_src !== value) {
            this._props.press_src = value;
            if (this._widget)
              this._widget.setProperty(hmUI.prop.MORE, {
                ...this.size,
                ...this.position,
                press_src: value,
              });
          }
        }
        break;
    }
  }
}
