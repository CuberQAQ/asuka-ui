/// <reference types="@zeppos/device-types" />
import hmUI from '@zos/ui';
import { getDeviceInfo } from '@zos/device';
import { reportError } from '../../debug/index.js';
export * from './native-bindings/index.js';
export const platform = {
    getWidgetFactorySize(mount) {
        if (mount === hmUI) {
            let { width, height } = getDeviceInfo();
            return { w: width, h: height };
        }
        else {
            try {
                return {
                    w: mount.getProperty(hmUI.prop.W),
                    h: mount.getProperty(hmUI.prop.H),
                };
            }
            catch {
                reportError('createFrame', Error('Get View size failed'));
            }
            throw 'Get View size failed';
        }
    },
};
//# sourceMappingURL=index.js.map