import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
import { PreferSizeManager } from '../../tools/widget';
type HmWidget = any;
export declare class NativeWidgetPolyline extends RenderWidget {
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
export declare interface NativeWidgetPolylineAttributes {
    color?: string;
    line_color?: string;
    lw?: number;
    line_width?: number;
}
export {};
//# sourceMappingURL=polyline.d.ts.map