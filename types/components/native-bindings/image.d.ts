import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
import { PreferSizeManager } from '../../tools/widget';
type HmWidget = any;
export declare class NativeWidgetImage extends RenderWidget {
    _widget: HmWidget | null;
    _props: Record<string, any>;
    _preferredSizeManager: PreferSizeManager;
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
    _updateDefaultSize(): void;
    setProperty(key: string, value: any): void;
}
export {};
//# sourceMappingURL=image.d.ts.map