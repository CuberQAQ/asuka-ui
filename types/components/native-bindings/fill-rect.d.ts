import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
type HmWidget = any;
export declare class NativeWidgetFillRect extends RenderWidget {
    _widget: HmWidget | null;
    _props: {
        color: number;
    };
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
}
export {};
//# sourceMappingURL=fill-rect.d.ts.map