import * as hmUI from '@zos/ui';
import { RenderWidget, WidgetFactory } from '../../core/base';
import { Size, Coordinate } from '../../core/layout';
type HmWidget = any;
export declare class NativeWidgetText extends RenderWidget {
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
export declare interface NativeWidgetTextAttributes {
    text?: string;
    color?: number;
    text_size?: number;
    text_style?: typeof hmUI.text_style.CHAR_WRAP;
    align_h?: typeof hmUI.align.CENTER_H;
    align_v?: typeof hmUI.align.CENTER_V;
}
export {};
//# sourceMappingURL=text.d.ts.map