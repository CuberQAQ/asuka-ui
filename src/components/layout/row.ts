import { Axis } from "../../core";
import { LayoutWidgetFlex } from "./flex";

export class LayoutWidgetRow extends LayoutWidgetFlex {
    _direction: Axis = Axis.horizontal;
}
export declare namespace LayoutWidgetRow {
    export interface Attributes extends LayoutWidgetFlex.Attributes {
        
    }
}