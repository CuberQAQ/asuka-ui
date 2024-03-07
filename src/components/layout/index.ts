import { NodeFactory } from '../../core/base';
import { LayoutWidgetAlign } from './align';
import { LayoutWidgetCenter } from './center';
import { LayoutWidgetHStack } from './hstack';
import { LayoutWidgetSizedBox } from './sizedbox';
import { LayoutWidgetVStack } from './vstack';

export const LayoutManagerFactory: NodeFactory = {
  createNode(type) {
    switch (type) {
      case 'hstack':
        return new LayoutWidgetHStack(null, 'hstack');
      case 'vstack':
        return new LayoutWidgetVStack(null, 'vstack');
      case 'center':
        return new LayoutWidgetCenter(null, 'center');
      case 'sized-box':
        return new LayoutWidgetSizedBox(null, 'sized-box');
      case 'align':
        return new LayoutWidgetAlign(null, 'align');
      default:
        return null;
    }
  },
};
