import { Alignment } from '../../core';
import { RenderNodeWithSingleChild } from '../../core/base';
export declare class LayoutWidgetAlign extends RenderNodeWithSingleChild {
    sizedByParent: boolean;
    _align: Alignment;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: any): void;
}
//# sourceMappingURL=align.d.ts.map