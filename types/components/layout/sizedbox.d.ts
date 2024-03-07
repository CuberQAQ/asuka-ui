import { Constraints } from '../../core';
import { RenderNodeWithSingleChild } from '../../core/base';
export declare class LayoutWidgetSizedBox extends RenderNodeWithSingleChild {
    protected _width: number | null;
    protected _height: number | null;
    _generateChildConstraints(): Constraints;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: any): void;
}
//# sourceMappingURL=sizedbox.d.ts.map