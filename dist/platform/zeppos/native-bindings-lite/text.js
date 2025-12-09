import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { px } from '@zos/utils';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {
    text: 'text',
    color: 0xffffff,
    text_size: Number(px(24)),
    // align_h: hmUI.align.CENTER_H,
    // align_v: hmUI.align.CENTER_V,
};
export class LiteWidgetText extends LiteWidget {
    _widget = null;
    _alpha = 255;
    _props = { ...defaultProps };
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.TEXT, {
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
            case 'text':
                {
                    this._props.text = '' + value;
                    if (this._widget) {
                        this._widget.setProperty(hmUI.prop.TEXT, '' + value);
                    }
                    this.markNeedsLayout();
                }
                break;
            case 'color':
                {
                    this._props.color = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.COLOR, value);
                }
                break;
            case 'text_size':
                {
                    this._props.text_size = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.TEXT_SIZE, value);
                }
                break;
            case 'text_style':
                {
                    this._props.text_style = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.TEXT_STYLE, value);
                }
                break;
            case 'align_h':
                {
                    this._props.align_h = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.ALIGN_H, value);
                }
                break;
            case 'align_v':
                {
                    this._props.align_v = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.ALIGN_V, value);
                }
                break;
            case 'line_space':
                {
                    this._props.line_space = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.LINE_SPACE, value);
                }
                break;
            case 'char_space':
                {
                    this._props.char_space = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.CHAR_SPACE, value);
                }
                break;
            case 'font':
                {
                    this._props.font = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.FONT, value);
                }
                break;
            case 'alpha':
                {
                    if (value !== this._alpha) {
                        this._alpha = value;
                        if (this._widget) {
                            this._widget?.setAlpha(value);
                        }
                    }
                }
        }
    }
}
//# sourceMappingURL=text.js.map