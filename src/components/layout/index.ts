import { NodeFactory } from '../../core/base.js';
import { LayoutWidgetAlign } from './align.js';
import { LayoutWidgetCenter } from './center.js';
import { LayoutWidgetColumn } from './column.js';
import {
  LayoutWidgetExpanded,
  LayoutWidgetFlex,
  LayoutWidgetFlexible,
  // LayoutWidgetSpacer,
} from './flex.js';
import { LayoutWidgetHStack } from './hstack.js';
import { LayoutWidgetPadding } from './padding.js';
import { LayoutWidgetRow } from './row.js';
import { LayoutWidgetSizedBox } from './sizedbox.js';
import { LayoutWidgetVStack } from './vstack.js';
import { LayoutWidgetPositioned, LayoutWidgetZStack } from './zstack.js';

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
      case 'sized-box':
      case 'space':
      case 'spacer':
        return new LayoutWidgetSizedBox(null, type);
      case 'align':
        return new LayoutWidgetAlign(null, type);
      case 'flex':
        return new LayoutWidgetFlex(null, type);
      case 'flexible':
        return new LayoutWidgetFlexible(null, type);
      case 'expanded':
        return new LayoutWidgetExpanded(null, type);
      // case 'spacer':
      // return new LayoutWidgetSpacer(null, type);
      case 'row':
        return new LayoutWidgetRow(null, type);
      case 'column':
        return new LayoutWidgetColumn(null, type);
      case 'padding':
        return new LayoutWidgetPadding(null, type);
      case 'stack':
      case 'zstack':
        return new LayoutWidgetZStack(null, type);
      case 'positioned':
        return new LayoutWidgetPositioned(null, type);
      default:
        return null;
    }
  },
};

export declare namespace LayoutManagerFactory {
  export interface AttributesMap {
    'hstack': LayoutWidgetHStack.Attributes;
    'vstack': LayoutWidgetVStack.Attributes;
    'center': LayoutWidgetCenter.Attributes;
    'sizedbox': LayoutWidgetSizedBox.Attributes;
    'sized-box': LayoutWidgetSizedBox.Attributes;
    'space': LayoutWidgetSizedBox.Attributes;
    'spacer': LayoutWidgetSizedBox.Attributes;
    'align': LayoutWidgetAlign.Attributes;
    'flex': LayoutWidgetFlex.Attributes;
    'flexible': LayoutWidgetFlexible.Attributes;
    'expanded': LayoutWidgetExpanded.Attributes;
    // 'spacer': LayoutWidgetSpacer.Attributes;
    'row': LayoutWidgetRow.Attributes;
    'column': LayoutWidgetColumn.Attributes;
    'padding': LayoutWidgetPadding.Attributes;
    'stack': LayoutWidgetZStack.Attributes;
    'zstack': LayoutWidgetZStack.Attributes;
    'positioned': LayoutWidgetPositioned.Attributes;
  }
}