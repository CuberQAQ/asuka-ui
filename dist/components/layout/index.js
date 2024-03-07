import { LayoutWidgetHStack } from './hstack';
export const LayoutManagerFactory = {
    createNode(type) {
        switch (type) {
            case 'hstack':
                return new LayoutWidgetHStack(null, 'hstack');
            default:
                return null;
        }
    },
};
//# sourceMappingURL=index.js.map