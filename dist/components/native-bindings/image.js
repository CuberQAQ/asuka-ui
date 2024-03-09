import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../core/base';
import { assert } from '../../debug/index';
import { PreferSizeManager } from '../../tools/widget';
const defaultProps = {};
export class NativeWidgetImage extends RenderWidget {
    constructor() {
        super(...arguments);
        this._widget = null;
        this._props = Object.assign({}, defaultProps);
        this._preferredSizeManager = new PreferSizeManager(this);
        this.sizedByParent = false;
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, Object.assign(Object.assign(Object.assign({}, this._props), position), size));
        }
        else {
            assert(this._widget != null);
            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this._props), position), size));
        }
    }
    onDestroy(widgetFactory) {
        assert(widgetFactory !== null && this._widget !== null);
        widgetFactory.deleteWidget(this._widget);
    }
    performResize() { }
    performLayout() { }
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
//# sourceMappingURL=image.js.map