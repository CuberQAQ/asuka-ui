import { NativeWidgetFillRect } from './fill-rect';
import { NativeWidgetText } from './text';
export const NativeBindingsFactory = {
    createNode(type) {
        switch (type) {
            case 'text':
                return new NativeWidgetText(null, 'text');
            case 'fillRect':
                return new NativeWidgetFillRect(null, 'fillRect');
            default:
                return null;
        }
    },
};
//# sourceMappingURL=index.js.map