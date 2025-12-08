import { type AsukaNode } from "./src/index.ts"
import { type LayoutManagerFactory } from "./src/index.ts"
import { type NativeWidgetAttributesTypeMap } from "./src/platform/zeppos/index.ts"


export declare type InsideIntrinsicElements = LayoutManagerFactory.AttributesMap & NativeWidgetAttributesTypeMap

export namespace JSX {
    export type IntrinsicElements = InsideIntrinsicElements
    export type Element = AsukaNode
}

export function jsx(type: any, props: any, key?: any): any;
export function jsxs(type: any, props: any, key?: any): any;
export function Fragment(props: { children?: any }): any;
