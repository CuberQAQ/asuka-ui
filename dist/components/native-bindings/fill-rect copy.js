import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../core/base';
import { Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
const defaultProps = {
    color: 0xcc0000,
};
export class NativeWidgetFillRect extends RenderWidget {
    constructor() {
        super(...arguments);
        this._widget = null;
        this._props = Object.assign({}, defaultProps);
        this.sizedByParent = true;
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, Object.assign(Object.assign(Object.assign({}, this._props), position), size));
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
    performLayout() {
        // assert(()=>{throw Error("Test Point 2")})
    }
    setProperty(key, value) {
        switch (key) {
            case 'radius':
                {
                    this._props.radius = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, Object.assign({}, this._props));
                }
                break;
            case 'color':
                {
                    this._props.color = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.COLOR, value);
                }
                break;
            case 'alpha':
                {
                    this._props.alpha = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, Object.assign({}, this._props));
                }
                break;
        }
    }
}
//# sourceMappingURL=fill-rect%20copy.js.map