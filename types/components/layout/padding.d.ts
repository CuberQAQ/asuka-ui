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
export declare namespace LayoutWidgetPadding {
    interface Attributes extends RenderNodeWithSingleChild.Attributes {
        p?: EdgeInsets;
        padding?: EdgeInsets;
    }
}
//# sourceMappingURL=padding.d.ts.map