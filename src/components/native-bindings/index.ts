import { NodeFactory } from '../../core/base.js';
import { NativeWidgetArc, NativeWidgetArcAttributes } from './arc.js';
import { NativeWidgetButton, NativeWidgetButtonAttributes } from './button.js';
import { NativeWidgetCanvas, NativeWidgetCanvasAttributes } from './canvas.js';
import { NativeWidgetCircle, NativeWidgetCircleAttributes } from './circle.js';
import { NativeWidgetFillRect, NativeWidgetFillRectAttributes } from './fill-rect.js';
import { NativeWidgetImage, NativeWidgetImageAttributes } from './image.js';
import { NativeWidgetPolyline, NativeWidgetPolylineAttributes } from './polyline.js';
import { NativeWidgetQRCode, NativeWidgetQRCodeAttributes } from './qrcode.js';
import { NativeWidgetRadioGroup, NativeWidgetRadioGroupAttributes } from './radio_group.js';
import { NativeWidgetStrokeRect, NativeWidgetStrokeRectAttributes } from './stroke-rect.js';
import { NativeWidgetText, NativeWidgetTextAttributes } from './text.js';

export const NativeBindingsFactory: NodeFactory = {
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

