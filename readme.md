# Asuka UI
Zepp OS UI 框架
## Features
- 虚拟 DOM：类似 HTML DOM，管理组件之间的层级关系
- 布局引擎：实现类似 Flutter 的布局约束模型，支持如 Flex 布局，Padding 等属性，自动计算布局
- 事件分发：将触屏等事件接入框架，可实现事件冒泡等操作
- 响应式设计：实现了 SolidJS 渲染器接口。自定义组件、响应式状态、JSX，应有尽有。
- 高扩展性：
  只需实现 Asuka UI 的组件接口，即可快速创建“Element”级的自定义组件，快速复用已有代码；
  反之，Asuka UI 可以挂载到 hmUI 或是某个 VIEW_CONTAINER 上，并指定长、宽，并能创建多个根节点，将 Asuka UI 当成一个 widget 使用。
