import { RenderWidget, WidgetFactory } from '../../core/base.js';
import { Size, Coordinate } from '../../core/layout.js';
import { PreferSizeAttributesMixin, PreferSizeManager } from '../../tools/widget.js';
type HmWidget = any;
export declare class NativeWidgetButton extends RenderWidget {
    _widget: HmWidget | null;
    _preferredSizeManager: PreferSizeManager;
    _props: Record<string, any>;
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
export declare interface NativeWidgetButtonAttributes extends PreferSizeAttributesMixin {
    text?: string;
    color?: number;
    size?: number;
    ts?: number;
    text_size?: number;
    nc?: number;
    ncolor?: number;
    normal_color?: number;
    pc?: number;
    pcolor?: number;
    press_color?: number;
    r?: number;
    radius?: number;
    ns?: string;
    nsrc?: string;
    normal_src?: string;
    ps?: string;
    psrc?: string;
    press_src?: string;
}
export {};
//# sourceMappingURL=button.d.ts.map