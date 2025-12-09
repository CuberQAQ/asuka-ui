// global.d.ts
import "solid-js";

declare global {
  namespace JSX {
    // 覆盖 SolidJS 的 JSX.Element
    type Element = import("@cuberqaq/asuka-ui/jsx-runtime").JSX.Element;
  }
}