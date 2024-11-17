import { LayoutManagerFactory } from './layout/index.js'
import { NativeWidgetAttributesTypeMap } from './native-bindings/index.js'

export * from './native-bindings/index.js'
export * from './layout/index.js'

export declare type InsideIntrinsicElements = NativeWidgetAttributesTypeMap & LayoutManagerFactory.AttributesMap & {
            
}
// declare global {
//     export namespace JSX {
//         export type IntrinsicElements = InsideIntrinsicElements
//     }
//   }