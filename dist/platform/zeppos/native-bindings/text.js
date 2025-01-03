import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../../core/base.js';
import { Constraints } from '../../../core/layout.js';
import { assert } from '../../../debug/index.js';
import { px } from '@zos/utils';
const defaultProps = {
    text: 'text',
    color: 0xffffff,
    text_size: Number(px(36)),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
};
export class NativeWidgetText extends RenderWidget {
    _widget = null;
    _props = { ...defaultProps };
    sizedByParent = false;
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.TEXT, {
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
    performResize() { }
    performLayout() {
        assert(Constraints.isValid(this._constraints));
        let { width: singleLineWidth, height: singleLineHeight } = hmUI.getTextLayout(this._props.text, {
            text_size: this._props.text_size,
            text_width: 0,
            wrapped: 0,
        });
        if (this._props.text_style !== undefined &&
            this._props.text_style === hmUI.text_style.WRAP) {
            // 文字可换行
            if (singleLineWidth > this._constraints.maxWidth) {
                // 换行
                let { width, height } = hmUI.getTextLayout(this._props.text, {
                    text_size: this._props.text_size,
                    text_width: this._constraints.maxWidth,
                    wrapped: 1,
                });
                this.size = this._constraints.constrain({ w: width, h: height });
            }
            else {
                // 单行
                this.size = this._constraints.constrain({
                    w: singleLineWidth,
                    h: singleLineHeight,
                });
            }
        }
        else {
            // 文字不可换行
            this.size = this._constraints.constrain({
                w: singleLineWidth,
                h: singleLineHeight,
            });
        }
        // this.size = this._constraints!.maxSize();
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
        }
    }
}
//# sourceMappingURL=text.js.map