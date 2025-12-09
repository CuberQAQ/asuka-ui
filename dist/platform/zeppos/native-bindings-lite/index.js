import { LiteWidgetArc } from './arc.js';
import { LiteWidgetButton } from './button.js';
import { LiteWidgetCanvas } from './canvas.js';
import { LiteWidgetFillRect, } from './fill-rect.js';
import { LiteWidgetImage } from './image.js';
import { LiteWidgetPolyline, } from './polyline.js';
import { LiteWidgetQRCode } from './qrcode.js';
import { LiteWidgetStrokeRect, } from './stroke-rect.js';
import { LiteWidgetText } from './text.js';
import { LiteBlock } from './lite-widget.js';
const nodeMap = {
    'l-block': LiteBlock,
    'l-text': LiteWidgetText,
    'l-fill-rect': LiteWidgetFillRect,
    'l-stroke-rect': LiteWidgetStrokeRect,
    'l-img': LiteWidgetImage,
    'l-button': LiteWidgetButton,
    'l-arc': LiteWidgetArc,
    'l-qrcode': LiteWidgetQRCode,
    'l-polyline': LiteWidgetPolyline,
    'l-canvas': LiteWidgetCanvas,
};
export const LiteBindingsFactory = {
    createNode(type) {
        return nodeMap[type] ? new nodeMap[type](null, type) : null;
    },
};
//# sourceMappingURL=index.js.map