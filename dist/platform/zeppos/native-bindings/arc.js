import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../../core/base.js';
import { Constraints } from '../../../core/layout.js';
import { assert } from '../../../debug/index.js';
import { PreferSizeManager } from '../../../tools/widget.js';
const defaultProps = {
    color: 0xcc0000,
    line_width: 5,
};
export class NativeWidgetArc extends RenderWidget {
    _widget = null;
    _preferredSizeManager = new PreferSizeManager(this);
    _props = { ...defaultProps };
    sizedByParent = false;
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.ARC, {
                ...this._props,
                ...position,
                ...size,
            });
        }
        else {
            assert(this._widget != null);
            this._widget.setProperty(hmUI.prop.MORE, {
                ...this._props,
                ...position,
                ...size,
            });
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
        this._preferredSizeManager.setProperty(key, value);
        switch (key) {
            case 'color':
                {
                    this._props.color = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.COLOR, value);
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
//# sourceMappingURL=arc.js.map