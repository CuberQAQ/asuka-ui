import { Axis } from '../../core/index.js';
import { LayoutWidgetFlex } from './flex.js';
export class LayoutWidgetColumn extends LayoutWidgetFlex {
    constructor() {
        super(...arguments);
        this._direction = Axis.vertical;
    }
}
//# sourceMappingURL=column.js.map