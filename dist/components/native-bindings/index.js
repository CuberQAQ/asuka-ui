import { NativeWidgetFillRect } from './fill-rect';
import { NativeWidgetText } from './text';
export const NativeBindingsFactory = {
    createNode(type) {
        switch (type) {
            case 'text':
                return new NativeWidgetText(null, 'text');
            case 'fill-rect':
                return new NativeWidgetFillRect(null, 'fill-rect');
            default:
                return null;
        }
    },
};
//# sourceMappingURL=index.js.map