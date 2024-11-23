import { NodeFactory } from '../../../core/base.js';
import { NativeWidgetArcAttributes } from './arc.js';
import { NativeWidgetButtonAttributes } from './button.js';
import { NativeWidgetCanvasAttributes } from './canvas.js';
import { NativeWidgetCircleAttributes } from './circle.js';
import { NativeWidgetFillRectAttributes } from './fill-rect.js';
import { NativeWidgetImageAttributes } from './image.js';
import { NativeWidgetPolylineAttributes } from './polyline.js';
import { NativeWidgetQRCodeAttributes } from './qrcode.js';
import { NativeWidgetRadioGroupAttributes } from './radio_group.js';
import { NativeWidgetStrokeRectAttributes } from './stroke-rect.js';
import { NativeWidgetTextAttributes } from './text.js';
export declare const NativeBindingsFactory: NodeFactory;
export declare interface NativeWidgetAttributesTypeMap {
    "text": NativeWidgetTextAttributes;
    "fill-rect": NativeWidgetFillRectAttributes;
    "fill_rect": NativeWidgetFillRectAttributes;
    "fillrect": NativeWidgetFillRectAttributes;
    "stroke-rect": NativeWidgetStrokeRectAttributes;
    "stroke_rect": NativeWidgetStrokeRectAttributes;
    "strokerect": NativeWidgetStrokeRectAttributes;
    "stroke": NativeWidgetStrokeRectAttributes;
    "image": NativeWidgetImageAttributes;
    "img": NativeWidgetImageAttributes;
    "button": NativeWidgetButtonAttributes;
    "circle": NativeWidgetCircleAttributes;
    "arc": NativeWidgetArcAttributes;
    "qrcode": NativeWidgetQRCodeAttributes;
    "polyline": NativeWidgetPolylineAttributes;
    "canvas": NativeWidgetCanvasAttributes;
    "radio": NativeWidgetRadioGroupAttributes;
    "radio_group": NativeWidgetRadioGroupAttributes;
    "radiogroup": NativeWidgetRadioGroupAttributes;
}
//# sourceMappingURL=index.d.ts.map