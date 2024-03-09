import { EdgeInsets } from '../../core';
import { RenderNodeWithSingleChild } from '../../core/base';
export declare class LayoutWidgetPadding extends RenderNodeWithSingleChild {
    sizedByParent: boolean;
    _padding: EdgeInsets;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: unknown): void;
}
//# sourceMappingURL=padding.d.ts.map