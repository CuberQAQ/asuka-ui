import { LayoutWidgetAlign } from './align';
import { LayoutWidgetCenter } from './center';
import { LayoutWidgetColumn } from './column';
import { LayoutWidgetExpanded, LayoutWidgetFlex, LayoutWidgetFlexible, LayoutWidgetSpacer, } from './flex';
import { LayoutWidgetHStack } from './hstack';
import { LayoutWidgetPadding } from './padding';
import { LayoutWidgetRow } from './row';
import { LayoutWidgetSizedBox } from './sizedbox';
import { LayoutWidgetVStack } from './vstack';
import { LayoutWidgetPositioned, LayoutWidgetZStack } from './zstack';
export const LayoutManagerFactory = {
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
//# sourceMappingURL=index.js.map