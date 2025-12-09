import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {};
export class LiteWidgetPolyline extends LiteWidget {
    _widget = null;
    _props = { ...defaultProps };
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.GRADKIENT_POLYLINE, {
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
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'color':
            case 'line_color':
                {
                    this._props.line_color = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.LINE_COLOR, value);
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
//# sourceMappingURL=polyline.js.map