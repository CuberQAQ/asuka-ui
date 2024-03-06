import { NativeWidgetText } from './text';
export const NativeBindingsFactory = {
    createNode(type) {
        switch (type) {
            case 'text':
                return new NativeWidgetText(null, 'text');
            default:
                return null;
        }
    },
};
//# sourceMappingURL=index.js.map