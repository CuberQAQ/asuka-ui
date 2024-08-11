import { LayoutManagerFactory } from "./layout/index";
import { NativeWidgetAttributesTypeMap } from "./native-bindings/index";
export * from "./native-bindings/index";
export * from "./layout/index";
export declare type InsideIntrinsicElements = NativeWidgetAttributesTypeMap & LayoutManagerFactory.AttributesMap & {};
declare global {
    namespace JSX {
        type IntrinsicElements = InsideIntrinsicElements;
    }
}
//# sourceMappingURL=index.d.ts.map