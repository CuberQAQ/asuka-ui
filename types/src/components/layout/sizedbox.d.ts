import { Constraints } from '../../core/index.js';
import { RenderNodeWithSingleChild } from '../../core/base.js';
export declare class LayoutWidgetSizedBox extends RenderNodeWithSingleChild {
    protected _width: number | null;
    protected _height: number | null;
    _generateChildConstraints(): Constraints;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: any): void;
}
export declare namespace LayoutWidgetSizedBox {
    interface Attributes extends RenderNodeWithSingleChild.Attributes {
        w?: number | null;
        width?: number | null;
        h?: number | null;
        height?: number | null;
    }
}
//# sourceMappingURL=sizedbox.d.ts.map