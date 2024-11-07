import { Alignment } from '../../core/index.js';
import { RenderNodeWithSingleChild } from '../../core/base.js';
export declare class LayoutWidgetAlign extends RenderNodeWithSingleChild {
    sizedByParent: boolean;
    _align: Alignment;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: any): void;
}
export declare namespace LayoutWidgetAlign {
    interface Attributes {
        x?: number;
        y?: number;
        alignment?: Alignment;
    }
}
//# sourceMappingURL=align.d.ts.map