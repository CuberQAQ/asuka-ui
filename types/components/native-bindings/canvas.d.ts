import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
type HmWidget = any;
export declare class NativeWidgetCanvas extends RenderWidget {
    _widget: HmWidget | null;
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
export declare interface NativeWidgetCanvasAttributes {
}
export {};
//# sourceMappingURL=canvas.d.ts.map