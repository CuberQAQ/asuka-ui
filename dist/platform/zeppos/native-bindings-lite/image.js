import * as hmUI from '@zos/ui';
import { assert } from '../../../debug/index.js';
import { LiteWidget } from './lite-widget.js';
const defaultProps = {};
export class LiteWidgetImage extends LiteWidget {
    _widget = null;
    _props = { ...defaultProps };
    sizedByParent = false;
    onCommit({ size, position, widgetFactory, initial, }) {
        if (initial) {
            assert(this._widget === null);
            this._widget = widgetFactory.createWidget(hmUI.widget.IMG, {
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
    // _updateDefaultSize() {
    //   if (this._props.src) {
    //     let { width, height } = (hmUI as any).getImageInfo(this._props.src);
    //     this._preferredSizeManager.setDefaultSize({ w: width, h: height });
    //   }
    // }
    setProperty(key, value) {
        super.setProperty(key, value);
        // this._preferredSizeManager.setProperty(key, value);
        switch (key) {
            // case 'alpha':
            //   {
            //     if (value !== this._props.alpha) {
            //       this._props.alpha = value;
            //       if (this._widget)
            //         this._widget.setProperty(hmUI.prop.MORE, { ...this._props });
            //     }
            //   }
            //   break;
            case 'pos_x':
                {
                    if (value !== this._props.pos_x) {
                        this._props.pos_x = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.POS_X, value);
                    }
                }
                break;
            case 'pos_y':
                {
                    if (value !== this._props.pos_y) {
                        this._props.pos_y = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.POS_Y, value);
                    }
                }
                break;
            case 'angle':
                {
                    if (value !== this._props.angle) {
                        this._props.angle = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.ANGLE, value);
                    }
                }
                break;
            case 'center_x':
                {
                    if (value !== this._props.center_x) {
                        this._props.center_x = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.CENTER_X, value);
                    }
                }
                break;
            case 'center_y':
                {
                    if (value !== this._props.center_y) {
                        this._props.center_y = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.CENTER_Y, value);
                    }
                }
                break;
            case 'alpha':
                {
                    if (value !== this._props.alpha) {
                        this._props.alpha = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.ALPHA, value);
                    }
                }
                break;
            case 'auto_scale':
                {
                    if (value !== this._props.auto_scale) {
                        this._props.auto_scale = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, {
                                ...this._props,
                            });
                    }
                }
                break;
            case 'auto_scale_obj_fit':
                {
                    if (value !== this._props.auto_scale_obj_fit) {
                        this._props.auto_scale_obj_fit = value;
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.MORE, {
                                ...this._props,
                            });
                    }
                }
                break;
            case 'src':
                {
                    if (value !== this._props.src) {
                        this._props.src = value;
                        // this._updateDefaultSize();
                        if (this._widget)
                            this._widget.setProperty(hmUI.prop.SRC, value);
                    }
                }
                break;
        }
    }
}
//# sourceMappingURL=image.js.map