import { RenderNode, Size } from '../core/index.js';
type NullableSize = {
    w: number | null;
    h: number | null;
};
export declare class PreferSizeManager {
    _node: RenderNode;
    _preferredSize: NullableSize | null;
    constructor(_node: RenderNode);
    _defaultSize: NullableSize | null;
    setDefaultSize(size: NullableSize | null): this;
    getDefaultSize(): NullableSize | null;
    _mixedSize: Size | null;
    _getMixedSize(): Size;
    /**
     * **根据已有属性选择最合适的尺寸**
     *
     * 请在`performLayout`中调用，本方法会将变化后的结果修改至宿主的`size`
     */
    chooseSize(): void;
    setProperty(key: string, value: any): void;
}
export declare interface PreferSizeAttributesMixin {
    w?: number | null;
    h?: number | null;
    width?: number | null;
    height?: number | null;
}
export {};
//# sourceMappingURL=widget.d.ts.map