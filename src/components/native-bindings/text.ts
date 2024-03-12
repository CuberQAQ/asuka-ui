import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';

type HmWidget = any;
const defaultProps = {
  text: 'text',
  color: 0xffffff,
  text_size: Number(px(36)),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};
export class NativeWidgetText extends RenderWidget {
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
      this._widget = widgetFactory.createWidget(hmUI.widget.TEXT, {
        ...this._props,
        ...position,
        ...size,
      });
    }
    else {
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
    
  }
  performLayout(): void {
    assert(Constraints.isValid(this._constraints));
    let { width: singleLineWidth, height: singleLineHeight } =
      hmUI.getTextLayout(this._props.text, {
        text_size: this._props.text_size,
        text_width: 0,
        wrapped: 0,
      });
    if (
      this._props.text_style !== undefined &&
      this._props.text_style === hmUI.text_style.WRAP
    ) {
      // 文字可换行
      if (singleLineWidth > this._constraints!.maxWidth) {
        // 换行
        let { width, height } = hmUI.getTextLayout(this._props.text, {
          text_size: this._props.text_size,
          text_width: this._constraints!.maxWidth,
          wrapped: 1,
        });
        this.size = this._constraints!.constrain({ w: width, h: height });
      } else {
        // 单行
        this.size = this._constraints!.constrain({
          w: singleLineWidth,
          h: singleLineHeight,
        });
      }
    } else {
      // 文字不可换行
      this.size = this._constraints!.constrain({
        w: singleLineWidth,
        h: singleLineHeight,
      });
    }
    // this.size = this._constraints!.maxSize();
  }
  setProperty(key: string, value: any): void {
    switch (key) {
      case 'text':
        {
          this._props.text = '' + value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.TEXT, '' + value);
        }
        break;
      case 'color':
        {
          this._props.color = value;
          if (this._widget) this._widget.setProperty(hmUI.prop.COLOR, value);
        }
        break;
      case 'text_size':
        {
          this._props.text_size = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.TEXT_SIZE, value);
        }
        break;
    }
  }
}
