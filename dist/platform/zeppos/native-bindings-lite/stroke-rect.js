import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {
    color: 0xcc4400,
};
export class LiteWidgetStrokeRect extends LiteWidget {
    _widget = null;
    _props = { ...defaultProps };
    _alpha = 255;
    sizedByParent = false;
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.STROKE_RECT, {
                ...this._props,
                ...position,
                ...size,
            });
            if (this._alpha !== 255) {
                this._widget?.setAlpha(this._alpha);
            }
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
            case 'r':
            case 'radius':
                {
                    this._props.radius = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, {
                            ...this.size,
                            ...this.position,
                            ...this._props,
                        });
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
                        this._widget.setProperty(hmUI.prop.MORE, {
                            ...this.size,
                            ...this.position,
                            ...this._props,
                        });
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
            case 'alpha':
                {
                    if (this._alpha !== value) {
                        this._alpha = value;
                        if (this._widget)
                            this._widget.setAlpha(value);
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=stroke-rect.js.map