import { RenderWidget, WidgetFactory } from '../../core/base.js';
import { Size, Coordinate } from '../../core/layout.js';
import { PreferSizeManager } from '../../tools/widget.js';
type HmWidget = any;
export declare class NativeWidgetCircle extends RenderWidget {
    _widget: HmWidget | null;
    _preferredSizeManager: PreferSizeManager;
    _props: Record<string, any>;
    sizedByParent: boolean;
    _fromSizeAndPositionToProp(size: Size, position: Coordinate): {
        radius: number;
        center_x: number;
        center_y: number;
    };
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
export declare interface NativeWidgetCircleAttributes {
    r?: number;
    radius?: number;
    color?: number;
    alpha?: number;
}
export {};
//# sourceMappingURL=circle.d.ts.map