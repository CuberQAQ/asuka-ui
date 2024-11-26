import { LayoutManagerFactory } from "./types"
import { NativeWidgetAttributesTypeMap } from "./types/platform/zeppos"


export declare type InsideIntrinsicElements = LayoutManagerFactory.AttributesMap & NativeWidgetAttributesTypeMap

export namespace JSX {
    export type IntrinsicElements = InsideIntrinsicElements
}