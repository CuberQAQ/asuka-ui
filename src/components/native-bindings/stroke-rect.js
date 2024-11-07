import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../core/base.js';
import { Constraints } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
import { PreferSizeManager } from '../../tools/widget.js';
const defaultProps = {
    color: 0xcc4400,
};
export class NativeWidgetStrokeRect extends RenderWidget {
    constructor() {
        super(...arguments);
        this._widget = null;
        this._preferredSizeManager = new PreferSizeManager(this);
        this._props = Object.assign({}, defaultProps);
        this.sizedByParent = false;
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.STROKE_RECT, Object.assign(Object.assign(Object.assign({}, this._props), position), size));
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
    performResize() {
        assert(Constraints.isValid(this._constraints));
        this.size = this._constraints.biggest;
    }
    performLayout() {
        this._preferredSizeManager.chooseSize();
        // assert(()=>{throw Error("Test Point 2")})
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        this._preferredSizeManager.setProperty(key, value);
        switch (key) {
            case 'r':
            case 'radius':
                {
                    this._props.radius = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), this._props));
                }
                break;
            case 'color':
                {
                    this._props.color = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.COLOR, value);
                }
                break;
            case 'angle':
                {
                    this._props.angle = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), this._props));
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
//# sourceMappingURL=stroke-rect.js.map