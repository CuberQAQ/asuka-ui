import { NodeFactory } from '../../core/base';
import { NativeWidgetFillRect } from './fill-rect';
import { NativeWidgetText } from './text';

export const NativeBindingsFactory: NodeFactory = {
  createNode(type) {
    switch (type) {
      case 'text':
        return new NativeWidgetText(null, type);
      case 'fill-rect':
      case 'fillrect':
        return new NativeWidgetFillRect(null, type);
      default:
        return null;
    }
  },
};
