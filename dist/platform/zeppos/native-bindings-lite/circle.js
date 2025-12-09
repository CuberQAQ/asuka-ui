import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { min } from '../../../tools/index.js';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {
    color: 0xff8888,
};
export class NativeWidgetCircle extends LiteWidget {
    _widget = null;
    _props = { ...defaultProps };
    _fromSizeAndPositionToProp(size, position) {
        let radius = min(size.h, size.w) / 2;
        return {
            radius,
            center_x: position.x + size.w / 2 - radius,
            center_y: position.y + size.h / 2 - radius,
        };
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, {
                ...this._props,
                ...this._fromSizeAndPositionToProp(size, position),
            });
        }
        else {
            assert(this._widget != null);
            this._widget.setProperty(hmUI.prop.MORE, {
                ...this._props,
                ...this._fromSizeAndPositionToProp(size, position),
            });
        }
    }
    onDestroy(widgetFactory) {
        assert(widgetFactory !== null && this._widget !== null);
        widgetFactory.deleteWidget(this._widget);
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        this._preferredSizeManager.setProperty(key, value);
        switch (key) {
            case 'r':
            case 'radius':
                {
                    this._preferredSizeManager.setDefaultSize({ w: value, h: value });
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
                        this._widget.setProperty(hmUI.prop.MORE, {
                            ...this.size,
                            ...this.position,
                            ...this._props,
                        });
                }
                break;
        }
    }
}
//# sourceMappingURL=circle.js.map