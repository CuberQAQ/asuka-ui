import { Axis } from "../../core";
import { LayoutWidgetFlex } from "./flex";

export class LayoutWidgetColumn extends LayoutWidgetFlex {
    _direction: Axis = Axis.vertical;
}