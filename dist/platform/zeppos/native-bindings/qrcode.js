import * as hmUI from '@zos/ui';
import { RenderWidget } from '../../../core/base.js';
import { Constraints } from '../../../core/layout.js';
import { assert } from '../../../debug/index.js';
import { PreferSizeManager } from '../../../tools/widget.js';
const defaultProps = {
    content: 'null',
};
// Not support bg_x bg_y bg_w bg_h, please use container or stack etc to add background decoration.
export class NativeWidgetQRCode extends RenderWidget {
    _widget = null;
    _preferredSizeManager = new PreferSizeManager(this);
    _props = { ...defaultProps };
    sizedByParent = false;
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.QRCODE, {
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
        super.setProperty(key, value);
        this._preferredSizeManager.setProperty(key, value);
        switch (key) {
            case 'content':
                {
                    this._props.content = value;
                    if (this._widget)
                        this._widget.setProperty(hmUI.prop.MORE, {
                            ...this.position,
                            ...this.size,
                            content: value,
                        });
                }
                break;
        }
    }
}
//# sourceMappingURL=qrcode.js.map