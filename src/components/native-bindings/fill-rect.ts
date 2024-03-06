import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';

type HmWidget = any;
const defaultProps = {
  color: 0xcc0000,
};
export class NativeWidgetText extends RenderWidget {
  _widget: HmWidget | null = null;
  _props = { ...defaultProps };
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
      this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, {
        ...hmUI.prop,
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
    assert(Constraints.isValid(this._constraints))
    this.size = this._constraints!.maxSize()
  }
  performLayout(): void {}
}
