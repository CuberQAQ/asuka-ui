import { RenderWidget, WidgetFactory } from '../../../core/base.js';
import { Size, Coordinate } from '../../../core/layout.js';
import { PreferSizeManager } from '../../../tools/widget.js';
type HmWidget = any;
export declare class NativeWidgetQRCode extends RenderWidget {
    _widget: HmWidget | null;
    _preferredSizeManager: PreferSizeManager;
    _props: Record<string, any>;
    sizedByParent: boolean;
    onCommit({ size, position, widgetFactory, initial, }: {
        size: Size;
        position: Coordinate;
        widgetFactory: WidgetFactory;
        initial?: boolean | undefined;
    }): void;
    onDestroy(widgetFactory: WidgetFactory): void;
    performResize(): void;
    performLayout(): void;
    setProperty(key: string, value: any): void;
}
export declare interface NativeWidgetQRCodeAttributes {
    content: string;
}
export {};
//# sourceMappingURL=qrcode.d.ts.map