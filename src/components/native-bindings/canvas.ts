import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget';

type HmWidget = any;
const defaultProps = {};
export class NativeWidgetCanvas extends RenderWidget {
  _widget: HmWidget | null = null;
  // _preferredSizeManager = new PreferSizeManager(this);
  _props: Record<string, any> = { ...defaultProps };
  sizedByParent: boolean = true;
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
  performResize(): void {
    assert(Constraints.isValid(this._constraints));
    this.size = this._constraints!.biggest;
  }
  performLayout(): void {
    // this._preferredSizeManager.chooseSize();
    // assert(()=>{throw Error("Test Point 2")})
  }
  setProperty(key: string, value: any): void {
    // this._preferredSizeManager.setProperty(key, value);
    switch (key) {
    }
  }
}
