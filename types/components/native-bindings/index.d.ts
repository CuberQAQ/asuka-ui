import { NodeFactory } from '../../core/base';
import { NativeWidgetArcAttributes } from './arc';
import { NativeWidgetButtonAttributes } from './button';
import { NativeWidgetCanvasAttributes } from './canvas';
import { NativeWidgetCircleAttributes } from './circle';
import { NativeWidgetFillRectAttributes } from './fill-rect';
import { NativeWidgetImageAttributes } from './image';
import { NativeWidgetPolylineAttributes } from './polyline';
import { NativeWidgetQRCodeAttributes } from './qrcode';
import { NativeWidgetRadioGroupAttributes } from './radio_group';
import { NativeWidgetStrokeRectAttributes } from './stroke-rect';
import { NativeWidgetTextAttributes } from './text';
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