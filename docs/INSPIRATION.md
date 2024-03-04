## Draggable 的一些思考
- 实际上在触发drag操作时，会复制一份被drag的子树(包括其子组件)。那么为了保证子树被复制和显示时不影响全局，子树甚至所有AsukaElement、AsukaNode、AsukaTextNode、AsukaWidget、AsukaContainer等都应当是纯粹无副作用的。也就是：给什么属性（无论属性的先后顺序、添加事件），只要该AsukaElement的copyElement被调用，返回的子树就应当能创建出来具有一模一样的样式的元素集，而不会影响其它任何东西。这对AsukaElement及其衍生类的纯粹性提出了绝对要求。
  1. AsukaElement等组件应保持纯粹性，根据给定属性画出相应的控件即可，无副作用
  2. AsukaElement应当有一个copy方法，返回包含了数据而未绘制的子树【还是算了，可以单独指定返回的子树，但是不能复制，不然同步属性修改麻烦】
  3. AsukaElement的数据处理和控件处理应当分离，利用数据可以随时还原出控件，也能删除暂时控件()
  4. AsukaElement甚至子树保存数据，当挂载到可绘制树上时再绘制，并且移除、再挂载不出问题(遍历子树)
  5. 包含相同属性的AsukaElement甚至子树可以初始化并显示出一模一样的图形
  6. 祖宗中是否存在WidgetFactory是AsukaElement能否渲染的关键。利用传参或者Context保存控件
- 为了保证dragging的控件显示在最上层，可以用hmUI.VIEW_CONTAINER，并制定好z_index规则。
- dragging子树应当能保持原有的布局(x, y, w, h)【麻烦，直接给下游开发者自己搞定】
  - 布局也应当能够被复制【感觉没必要，或者后面看看】
  - 属性的管理应当交给框架，让下游开发者只需负责属性的创建、修改、取值。那么属性应当规范化。
- dragging控件应当默认去除所有额外的响应事件，否则容易出bug(点击，长按，滑动)。但也可以保留着部分功能，提高自由度。【dragging控件由框架使用者自己构建一棵子树生成，不加事件就没问题】
- 默认dragging控件？
- 一切好用的基础上要保证优化到位
- dragging控件应当可以跨frame甚至跨app传送


## Keyboard 键盘的支持


## 支持按钮/表冠操作
### Focus 焦点及其事件
### 调用表冠、按键等传感器资源的协调
### Key 及其事件
### DigitalCrown 及其事件
### 更多自定义高级交互的支持
- 反转手腕
- 摇一摇

## AsukaUI 和 AsukaSolid 的互相关系与支持

## 布局更新与属性修改
- AsukaUI::update 何时调用？（用来更新布局与触发onCommit，可能负责初始化），部分属性的更新交给setAttribute直接处理得了（但是要保证没初始化时更改对初始化后也有效，属性是长期的，应保证不与控件有关）
注：实际上保证 初始化 和 布局需要重新计算 时调用即可
  - 当事件中时：
  - setAttribute中：判断是否需要修改offset,contentSize,size中的一项，若需要，就调用AsukaLayout::changeXXX，自己仅判断不处理
    - 
  - 修改布局敏感参数（可能是AsukaLayout::changeOffset|changeContentSize|changeSize）的一种：由AsukaLayout发出update请求（event还是直接调用AsukaUI::update？）
  - AsukaSolid的customRenderer::setProperty: 调用AsukaElement的setProperty之类，自己不处理也不判断
- Asuka::update可以使用共用一个AsyncManager(立即resolve的Promise，或者0延时的setTimeout)，但要提供立即update的方法（不过这样是否能够保证剩下的操作不再需要Async了也很难说，或许可以给一个保证能够一次性update完的方法？）


## 其它

- AsukaElement 和 AlementWidget职责区别：前者占用布局节点，但无实体组件；后者有实体组件


## Attributes Properties Styles
已知
  - (未确认)SolidJS将styles className onXXX当作普通属性给CustomRender::setProperty 调用（不知道ref，on:xxx之类怎么样），也就是可以自己决定是否使用styles这类参数，并且可以知道这些属性何时改变（Preact里style是直接element.styles.xxx = xxx赋值，监听要一个一个Object.defineProperty来绑定，相比之下SolidJS就好很多。）
- 考虑自定义布局容器（如flexbox）如何 访问 和 监听 子控件的非标准布局属性（如flexDirection）
  - 监听标准属性的当前方法：让AsukaElement在setAttribute之类里调用AsukaLayout::changeXXX。是否需要改变成固定属性，并由AsukaLayout或者AsukaElement基类实现监听操作？
    - 各种属性的决定因素分析
      - size (w, h)：可由外部决定，但不一定有效（比如固定大小的控件）
      - contentSize (w, h): 需要由AsukaElement内部决定
      - offset (x, y): 应当可由外部决定
      - custom (flexDirection flexBasic): 只由外部决定
    - 属性处理方式：
      - 将property提前给过滤器处理，选择是否接管
        - 装饰器过滤（好处：严格接管，坏处：性能以及兼容性）
        - 提供过滤方法，要求在setAttibute顶部调用（好处：灵活，坏处：要和框架使用者书面约定）【用这个】
          - 谁提供过滤方法？AsukaLayout？AsukaElement?
        - 内部方法先接管再调用
  
  - 监听非标准自定义属性的方法与标准：
    - 
- 衍生出另一个问题：布局的脏检测与局部更新如何实现？


## Asuka Layout
- 灵感
  - 可以搞个defaultSize, defaultOffset 链式调用（？有必要？）
  - 不同的布局组件可以自己实现自己的AsukaLayout，然后AsukaLayout和AsukaWidget分离，可以自由装配。比如FlexLayout extends AsukaLayout和Flexbox extends AsukaWidget可以分离，这样FlexLayout就可以用在其它使用flexbox布局的Widget上
    - 那么，AsukaLayout和AsukaWidget的耦合度应尽可能低，不存在某种AsukaLayout过度依赖AsukaContainer的情况（不过AsukaLayout可以依赖AsukaLayout，胶水代码放在AsukaContainer的实现中）
- ParentOffset 和 SelfOffset 以及 不同WidgetFactroy(比如hmUI和ViewContainer的实际原点不一样) 之间的关系