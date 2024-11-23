/// <reference types="@zeppos/device-types" />
import hmUI from '@zos/ui';
import { Platform, WidgetFactory } from '../../core/base.js';
import { getDeviceInfo } from '@zos/device';
import { reportError } from '../../debug/index.js';
import { NativeWidgetAttributesTypeMap } from './native-bindings/index.js'

export * from './native-bindings/index.js'

export const platform: Platform = {
  getWidgetFactorySize(mount: WidgetFactory) {
    if (mount === hmUI) {
      let { width, height } = getDeviceInfo();
      return { w: width, h: height };
    } else {
      try {
        return {
          w: (mount as any).getProperty(hmUI.prop.W),
          h: (mount as any).getProperty(hmUI.prop.H),
        };
      } catch {
        reportError('createFrame', Error('Get View size failed'));
      }
      throw 'Get View size failed';
    }
  },
};
