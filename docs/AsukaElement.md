# AsukaElement 元素类
- 继承自AsukaNode，可以有子节点。有点类似HTMLElement



## 杂项

- 只应当在setAttribute setProperty setStyle之类的东西改变内置属性（可能是_attribute之类的），原因是保证复制函数或者重复commit函数时不影响属性，保证元素Element纯粹性。
- 或者干脆直接把_attribute设置为私有，然后传给setAttribute，不让其它方法访问？【好像没用，可以直接调用setAttribute，干脆直接做一个调用约定好了】
- 如何处理事件中的属性修改？【直接setAttribute】
- 如何保证一个AsukaElement的多个副本同时收到setAttribute的通知呢？好像没必要...【好像没有AsukaElement需要复制的情况，还是算了】
- 需要在其他地方直接修改_attribute的情况?(肯定是在AsukaElement及其子类里，外部绝对不行！)
- _attribute 谁可访问？，各方面对属性的职责?
  - AsukaElement:
  - AsukaWidget:
  - AsukaApp: