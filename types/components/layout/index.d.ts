import { NodeFactory } from '../../core/base';
import { LayoutWidgetAlign } from './align';
import { LayoutWidgetCenter } from './center';
import { LayoutWidgetColumn } from './column';
import { LayoutWidgetExpanded, LayoutWidgetFlex, LayoutWidgetFlexible } from './flex';
import { LayoutWidgetHStack } from './hstack';
import { LayoutWidgetPadding } from './padding';
import { LayoutWidgetRow } from './row';
import { LayoutWidgetSizedBox } from './sizedbox';
import { LayoutWidgetVStack } from './vstack';
import { LayoutWidgetPositioned, LayoutWidgetZStack } from './zstack';
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