import { Axis } from '../../core/index.js';
import { LayoutWidgetFlex } from './flex.js';
export class LayoutWidgetRow extends LayoutWidgetFlex {
    constructor() {
        super(...arguments);
        this._direction = Axis.horizontal;
    }
}
//# sourceMappingURL=row.js.map