import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {};
export class LiteWidgetCanvas extends LiteWidget {
    _widget = null;
    // _preferredSizeManager = new PreferSizeManager(this);
    _props = { ...defaultProps };
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.CANVAS, {
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
}
;
//# sourceMappingURL=canvas.js.map