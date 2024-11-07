import { NodeFactory } from '../../core/base.js';
import { LayoutWidgetAlign } from './align.js';
import { LayoutWidgetCenter } from './center.js';
import { LayoutWidgetColumn } from './column.js';
import { LayoutWidgetExpanded, LayoutWidgetFlex, LayoutWidgetFlexible } from './flex.js';
import { LayoutWidgetHStack } from './hstack.js';
import { LayoutWidgetPadding } from './padding.js';
import { LayoutWidgetRow } from './row.js';
import { LayoutWidgetSizedBox } from './sizedbox.js';
import { LayoutWidgetVStack } from './vstack.js';
import { LayoutWidgetPositioned, LayoutWidgetZStack } from './zstack.js';
export declare const LayoutManagerFactory: NodeFactory;
export declare namespace LayoutManagerFactory {
    interface AttributesMap {
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
        'row': LayoutWidgetRow.Attributes;
        'column': LayoutWidgetColumn.Attributes;
        'padding': LayoutWidgetPadding.Attributes;
        'stack': LayoutWidgetZStack.Attributes;
        'zstack': LayoutWidgetZStack.Attributes;
        'positioned': LayoutWidgetPositioned.Attributes;
    }
}
//# sourceMappingURL=index.d.ts.map