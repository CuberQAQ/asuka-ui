import { Alignment, Constraints, RenderNodeProxy, RenderNodeWithMultiChildren, Size, StackFit } from '../../core';
export declare class LayoutWidgetZStack extends RenderNodeWithMultiChildren {
    _align: Alignment;
    _fit: StackFit;
    _computeSize(constraints: Constraints): Size;
    _layoutPositionedChild(child: LayoutWidgetPositioned): void;
    performResize(): void;
    performLayout(): void;
    performCommit(): void;
    setProperty(key: string, value: any): void;
}
export declare namespace LayoutWidgetZStack {
    interface Attributes {
        ali?: Alignment;
        align?: Alignment;
        alignment?: Alignment;
        fit?: StackFit;
    }
}
export declare class LayoutWidgetPositioned extends RenderNodeProxy {
    _left: number | null;
    _right: number | null;
    _top: number | null;
    _bottom: number | null;
    _width: number | null;
    _height: number | null;
    setProperty(key: string, value: any): void;
}
export declare namespace LayoutWidgetPositioned {
    interface Attributes extends RenderNodeProxy.Attributes {
        l?: number;
        x?: number;
        left?: number;
        r?: number;
        right?: number;
        t?: number;
        y?: number;
        top?: number;
        up?: number;
        b?: number;
        bottom?: number;
        w?: number;
        width?: number;
        h?: number;
        height?: number;
    }
}
//# sourceMappingURL=zstack.d.ts.map