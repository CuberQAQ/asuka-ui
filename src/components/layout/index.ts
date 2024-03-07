import { NodeFactory } from '../../core/base';
import { LayoutWidgetHStack } from './hstack';

export const LayoutManagerFactory: NodeFactory = {
  createNode(type) {
    switch (type) {
      case 'hstack':
        return new LayoutWidgetHStack(null, 'hstack');
      default:
        return null;
    }
  },
};
