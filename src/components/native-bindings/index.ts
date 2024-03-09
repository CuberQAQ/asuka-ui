import { NodeFactory } from '../../core/base';
import { NativeWidgetArc } from './arc';
import { NativeWidgetButton } from './button';
import { NativeWidgetCanvas } from './canvas';
import { NativeWidgetCircle } from './circle';
import { NativeWidgetFillRect } from './fill-rect';
import { NativeWidgetImage } from './image';
import { NativeWidgetPolyline } from './polyline';
import { NativeWidgetQRCode } from './qrcode';
import { NativeWidgetStrokeRect } from './stroke-rect';
import { NativeWidgetText } from './text';

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
      default:
        return null;
    }
  },
};
