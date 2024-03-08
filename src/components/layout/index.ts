import { NodeFactory } from '../../core/base';
import { LayoutWidgetAlign } from './align';
import { LayoutWidgetCenter } from './center';
import { LayoutWidgetColumn } from './column';
import {
  LayoutWidgetExpanded,
  LayoutWidgetFlex,
  LayoutWidgetFlexible,
  LayoutWidgetSpacer,
} from './flex';
import { LayoutWidgetHStack } from './hstack';
import { LayoutWidgetRow } from './row';
import { LayoutWidgetSizedBox } from './sizedbox';
import { LayoutWidgetVStack } from './vstack';

export const LayoutManagerFactory: NodeFactory = {
  createNode(type) {
    switch (type) {
      case 'hstack':
        return new LayoutWidgetHStack(null, type);
      case 'vstack':
        return new LayoutWidgetVStack(null, type);
      case 'center':
        return new LayoutWidgetCenter(null, type);
      case 'sizedbox':
        return new LayoutWidgetSizedBox(null, type);
      case 'align':
        return new LayoutWidgetAlign(null, type);
      case 'flex':
        return new LayoutWidgetFlex(null, type);
      case 'flexible':
        return new LayoutWidgetFlexible(null, type);
      case 'expanded':
        return new LayoutWidgetExpanded(null, type);
      case 'spacer':
        return new LayoutWidgetSpacer(null, type);
      case 'row':
        return new LayoutWidgetRow(null, type);
      case 'column':
        return new LayoutWidgetColumn(null, type);

      default:
        return null;
    }
  },
};
