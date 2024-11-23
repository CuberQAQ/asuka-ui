import { RenderWidget, RenderWidgetFactoryProvider, WidgetFactory } from '../../../core/base.js';
import { Size, Coordinate } from '../../../core/layout.js';
import { PreferSizeManager } from '../../../tools/widget.js';
type HmWidget = any;
export declare class NativeWidgetRadioGroup extends RenderWidgetFactoryProvider {
    _widget: HmWidget | null;
    _props: Record<string, any>;
    _defaultChecked: number;
    _registeredTask: (() => any) | null;
    _stateButtonWidget: any[];
    _registerAfterAsyncTask(): void;
    _initChildWidgetFactory(): void;
    onCommit({ size, position, widgetFactory, initial, }: {
        size: Size;
        position: Coordinate;
        widgetFactory: WidgetFactory;
        initial?: boolean | undefined;
    }): void;
    onDestroy(widgetFactory: WidgetFactory): void;
    setProperty(key: string, value: any): void;
}
export declare class NativeWidgetStateButton extends RenderWidget {
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
export declare interface NativeWidgetRadioGroupAttributes {
    select_src: string;
    unselect_src: string;
}
export declare interface NativeWidgetStateButtonAttributes {
    r?: number;
    radius?: number;
    color?: number;
    alpha?: number;
}
export {};
//# sourceMappingURL=radio_group.d.ts.map