import { NodeFactory } from '../../core/base';
import { NativeWidgetText } from './text';

export const NativeBindingsFactory: NodeFactory = {
  createNode(type) {
    switch (type) {
      case 'text':
        return new NativeWidgetText(null, 'text');
      default:
        return null;
    }
  },
};
