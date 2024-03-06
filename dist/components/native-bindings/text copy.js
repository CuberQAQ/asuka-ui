import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../core/base';
import { Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
const defaultProps = {
    text: 'empty text',
    color: 0xffffff,
    text_size: px(36),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
};
export class NativeWidgetText extends RenderWidget {
    constructor() {
        super(...arguments);
        this._widget = null;
        this._props = Object.assign({}, defaultProps);
        this.sizedByParent = true;
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.TEXT, Object.assign(Object.assign(Object.assign({}, hmUI.prop), position), size));
        }
    }
    onDestroy(widgetFactory) {
        assert(widgetFactory !== null && this._widget !== null);
        widgetFactory.deleteWidget(this._widget);
    }
    performResize() {
        assert(Constraints.isValid(this._constraints));
        this.size = this._constraints.maxSize();
    }
    performLayout() { }
}
//# sourceMappingURL=text%20copy.js.map