import { RenderWidget, WidgetFactory } from '../../../core/base.js';
import { Size, Coordinate } from '../../../core/layout.js';
import { PreferSizeManager } from '../../../tools/widget.js';
type HmWidget = any;
export declare class NativeWidgetStrokeRect extends RenderWidget {
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
export declare interface NativeWidgetStrokeRectAttributes {
    r?: number;
    radius?: number;
    color?: number;
    lw?: number;
    line_width?: number;
    angle?: number;
}
export {};
//# sourceMappingURL=stroke-rect.d.ts.map