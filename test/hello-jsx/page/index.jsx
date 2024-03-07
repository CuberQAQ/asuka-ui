import * as hmUI from '@zos/ui';
import {
  AsukaUI,
  Color,
  LayoutManagerFactory,
  NativeBindingsFactory,
  createViewRenderer,
  range,
} from '@cuberqaq/asuka-ui';
Page({
  build() {
    const asuka = new AsukaUI();
    asuka.registerNodeFactory(NativeBindingsFactory);
    asuka.registerNodeFactory(LayoutManagerFactory);
    const mainView = asuka.mountView(hmUI);
    const renderer = createViewRenderer(asuka);

    renderer.render(<text text='Hello JSX' color={0xcc0000} />, mainView);
    asuka.refreshSync();
  },
});
