import { Axis } from '../../core/index.js';
import { LayoutWidgetFlex } from './flex.js';

export class LayoutWidgetColumn extends LayoutWidgetFlex {
  _direction: Axis = Axis.vertical;
}

export declare namespace LayoutWidgetColumn {
  export interface Attributes extends LayoutWidgetFlex.Attributes {}
}
