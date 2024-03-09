import { RenderNode, RenderNodeProxy, RenderNodeWithMultiChildren } from '../../core/base';
import { Axis, CrossAxisAlignment, FlexFit, HorizontalDirection, MainAxisAlignment, MainAxisSize, Size, TextBaseline, VerticalDirection } from '../../core/layout';
export declare class LayoutWidgetFlex extends RenderNodeWithMultiChildren {
    _direction: Axis;
    _mainAxisAlignment: MainAxisAlignment;
    _mainAxisSize: MainAxisSize;
    _crossAxisAlignment: CrossAxisAlignment;
    _horizonDirection: HorizontalDirection;
    _verticalDirection: VerticalDirection;
    _textBaseline: TextBaseline | null;
    _overflow: number;
    sizedByParent: boolean;
    setProperty(key: string, value: any): void;
    /**
     * sizedByParent == true，即_mainAxisSize == MainAxisSize.max时的布局
     *
     * 直接maxSize就完事儿了
     */
    performResize(): void;
    _getFlex(child: RenderNode): number;
    _getFit(child: RenderNode): FlexFit;
    _getMainSize(size: Size): number;
    _getCrossSize(size: Size): number;
    _startIsTopLeft(direction: Axis): boolean | null;
    _computeSizes(): {
        mainSize: number;
        crossSize: number;
        allocatedSize: number;
    };
    performLayout(): void;
    performCommit(): void;
}
export declare class LayoutWidgetFlexible extends RenderNodeProxy {
    _fit: FlexFit;
    _flex: number;
    onMount(): void;
    setProperty(key: string, value: any): void;
}
export declare class LayoutWidgetExpanded extends LayoutWidgetFlexible {
    _fit: FlexFit;
}
export declare class LayoutWidgetSpacer extends LayoutWidgetExpanded {
    setProperty(key: string, value: any): void;
}
//# sourceMappingURL=flex.d.ts.map