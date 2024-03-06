import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
type HmWidget = any;
export declare class NativeWidgetText extends RenderWidget {
    _widget: HmWidget | null;
    _props: {
        text: string;
        color: number;
        text_size: string;
        align_h: number;
        align_v: number;
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
//# sourceMappingURL=text%20copy.d.ts.map