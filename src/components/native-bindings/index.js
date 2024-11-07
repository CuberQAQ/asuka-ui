import { NativeWidgetArc } from './arc.js';
import { NativeWidgetButton } from './button.js';
import { NativeWidgetCanvas } from './canvas.js';
import { NativeWidgetCircle } from './circle.js';
import { NativeWidgetFillRect } from './fill-rect.js';
import { NativeWidgetImage } from './image.js';
import { NativeWidgetPolyline } from './polyline.js';
import { NativeWidgetQRCode } from './qrcode.js';
import { NativeWidgetRadioGroup } from './radio_group.js';
import { NativeWidgetStrokeRect } from './stroke-rect.js';
import { NativeWidgetText } from './text.js';
export const NativeBindingsFactory = {
    createNode(type) {
        switch (type) {
            case 'text':
                return new NativeWidgetText(null, type);
            case 'fill-rect':
            case 'fill_rect':
            case 'fillrect':
                return new NativeWidgetFillRect(null, type);
            case 'stroke-rect':
            case 'stroke_rect':
            case 'strokerect':
            case 'stroke':
                return new NativeWidgetStrokeRect(null, type);
            case 'image':
            case 'img':
                return new NativeWidgetImage(null, type);
            case 'button':
                return new NativeWidgetButton(null, type);
            case 'circle':
                return new NativeWidgetCircle(null, type);
            case 'arc':
                return new NativeWidgetArc(null, type);
            case 'qrcode':
                return new NativeWidgetQRCode(null, type);
            case 'polyline':
                return new NativeWidgetPolyline(null, type);
            case 'canvas':
                return new NativeWidgetCanvas(null, type);
            case 'radio':
            case 'radio_group':
            case 'radiogroup':
                return new NativeWidgetRadioGroup(null, type);
            default:
                return null;
        }
    },
};
//# sourceMappingURL=index.js.map