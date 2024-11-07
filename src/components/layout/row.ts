import { Axis } from '../../core/index.js';
import { LayoutWidgetFlex } from './flex.js';

export class LayoutWidgetRow extends LayoutWidgetFlex {
    _direction: Axis = Axis.horizontal;
}
export declare namespace LayoutWidgetRow {
    export interface Attributes extends LayoutWidgetFlex.Attributes {
        
    }
}