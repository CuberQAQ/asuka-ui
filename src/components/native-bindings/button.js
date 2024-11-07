import * as hmUI from '@zos/ui';
import { AsukaEvent, RenderWidget } from '../../core/base.js';
import { Size, Constraints } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget.js';
const defaultProps = {
    text_size: px(36),
};
export class NativeWidgetButton extends RenderWidget {
    constructor() {
        super(...arguments);
        this._widget = null;
        this._preferredSizeManager = new PreferSizeManager(this).setDefaultSize(Size.infinite);
        this._props = Object.assign({}, defaultProps);
    }
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.BUTTON, Object.assign(Object.assign(Object.assign(Object.assign({}, this._props), position), size), { click_func: () => {
                    this.dispatchEvent(new AsukaEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    }));
                }, longpress_func: () => {
                    this.dispatchEvent(new AsukaEvent('longpress', {
                        bubbles: true,
                        cancelable: true,
                    }));
                } }));
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
    _updateDefaultSize() {
        if (this._props.normal_src) {
            let { width, height } = hmUI.getImageInfo(this._props.normal_src);
            this._preferredSizeManager.setDefaultSize({ w: width, h: height });
        }
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        this._preferredSizeManager.setProperty(key, value);
        console.log(`set ${key} to ${value}`);
        switch (key) {
            case 'text':
                {
                    if (this._props.text !== value) {
                        this._props.text = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { text: value }));
                    }
                }
                break;
            case 'color':
                {
                    if (this._props.color !== value) {
                        this._props.color = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { color: value }));
                    }
                }
                break;
            case 'size':
            case 'ts':
            case 'text_size':
                {
                    if (this._props.text_size !== value) {
                        this._props.text_size = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { text_size: value }));
                    }
                }
                break;
            case 'nc':
            case 'ncolor':
            case 'normal_color':
                {
                    if (this._props.normal_color !== value) {
                        this._props.normal_color = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { normal_color: value }));
                    }
                }
                break;
            case 'pc':
            case 'pcolor':
            case 'press_color':
                {
                    if (this._props.press_color !== value) {
                        this._props.press_color = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { press_color: value }));
                    }
                }
                break;
            case 'r':
            case 'radius':
                {
                    if (this._props.radius !== value) {
                        this._props.radius = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { radius: value }));
                    }
                }
                break;
            case 'ns':
            case 'nsrc':
            case 'normal_src':
                {
                    if (this._props.normal_src !== value) {
                        this._props.normal_src = value;
                        this._updateDefaultSize();
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { normal_src: value }));
                    }
                }
                break;
            case 'ps':
            case 'psrc':
            case 'press_src':
                {
                    if (this._props.press_src !== value) {
                        this._props.press_src = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, Object.assign(Object.assign(Object.assign({}, this.size), this.position), { press_src: value }));
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=button.js.map