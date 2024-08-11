import * as hmUI from '@zos/ui';
import {
  RenderWidget,
  RenderWidgetFactoryProvider,
  WidgetFactory,
} from '../../core/base';
import { Size, Coordinate, Constraints } from '../../core/layout';
import { assert } from '../../debug/index';
import { px } from '@zos/utils';
import { PreferSizeManager } from '../../tools/widget';
import { findWhere, splice } from '../../core';

type HmWidget = any;
const defaultProps = {
  color: 0xcc0000,
};
export class NativeWidgetRadioGroup extends RenderWidgetFactoryProvider {
  _widget: HmWidget | null = null;
  _props: Record<string, any> = { ...defaultProps };
  _defaultChecked: number = 0;
  _registeredTask: (() => any) | null = null;
  _stateButtonWidget: any[] = [];
  _registerAfterAsyncTask() {
    assert(this._attached);
    assert(this._core != null);
    if (this._registeredTask !== null) {
      this._registeredTask = () => {
        this._registeredTask = null;
        assert(this._widget != null);
        if (this._stateButtonWidget.length > 0) {
          assert(this._defaultChecked < this._stateButtonWidget.length);
          this._widget.setProperty(
            (hmUI.prop as any).INIT,
            this._stateButtonWidget[this._defaultChecked],
          );
        }
      };
      this._core!.addRunAfterAsync(this._registeredTask);
    }
  }
  _initChildWidgetFactory() {
    this.childWidgetFactory = {
      createWidget: (widgetType, option) => {
        assert(this._widget != null);
        let widget = this._widget.createWidget(widgetType, option);
        if (widgetType === hmUI.widget.STATE_BUTTON) {
          this._stateButtonWidget.push(widget);
        }
      },
      deleteWidget: (widget) => {
        if (widget.getType() === hmUI.widget.STATE_BUTTON) {
          //   let index = findWhere(this._stateButtonWidget, widget, true);
          // TODO do some operations to make everything right

          splice(this._stateButtonWidget, widget);
        }
        assert(this._widget != null);
        this._widget.deleteWidget(widget);
      },
    };
  }
  onCommit({
    size,
    position,
    widgetFactory,
    initial,
  }: {
    size: Size;
    position: Coordinate;
    widgetFactory: WidgetFactory;
    initial?: boolean | undefined;
  }): void {
    assert(this._props.select_src != null);
    assert(this._props.unselect_src != null);
    if (initial) {
      assert(this._widget === null);
      this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, {
        ...this._props,
        ...position,
        ...size,
      });
      this._initChildWidgetFactory();
    } else {
      assert(this._widget != null);
      this._widget!.setProperty(hmUI.prop.MORE, {
        ...this._props,
        ...position,
        ...size,
      });
    }
  }
  onDestroy(widgetFactory: WidgetFactory): void {
    assert(widgetFactory !== null && this._widget !== null);
    widgetFactory.deleteWidget(this._widget);
  }
  setProperty(key: string, value: any): void {
    switch (key) {
      case 'select_src':
        {
          this._props.select_src = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
      case 'unselect_src':
        {
          this._props.unselect_src = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
    }
  }
}

// TODO 啥都没干
const stateButtonDefaultProps = {
  color: 0xcc0000,
};
export class NativeWidgetStateButton extends RenderWidget {
  _widget: HmWidget | null = null;
  _preferredSizeManager = new PreferSizeManager(this);
  _props: Record<string, any> = { ...stateButtonDefaultProps };
  sizedByParent: boolean = false;
  onCommit({
    size,
    position,
    widgetFactory,
    initial,
  }: {
    size: Size;
    position: Coordinate;
    widgetFactory: WidgetFactory;
    initial?: boolean | undefined;
  }): void {
    if (initial) {
      assert(this._widget === null);
      this._widget = widgetFactory.createWidget(hmUI.widget.FILL_RECT, {
        ...this._props,
        ...position,
        ...size,
      });
    } else {
      assert(this._widget != null);
      this._widget!.setProperty(hmUI.prop.MORE, {
        ...this._props,
        ...position,
        ...size,
      });
    }
  }
  onDestroy(widgetFactory: WidgetFactory): void {
    assert(widgetFactory !== null && this._widget !== null);
    widgetFactory.deleteWidget(this._widget);
  }
  performResize(): void {
    assert(Constraints.isValid(this._constraints));
    this.size = this._constraints!.biggest;
  }
  performLayout(): void {
    this._preferredSizeManager.chooseSize();
    // assert(()=>{throw Error("Test Point 2")})
  }
  setProperty(key: string, value: any): void {
    super.setProperty(key, value);
    this._preferredSizeManager.setProperty(key, value);
    switch (key) {
      case 'r':
      case 'radius':
        {
          this._props.radius = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
      case 'color':
        {
          this._props.color = value;
          if (this._widget) this._widget.setProperty(hmUI.prop.COLOR, value);
        }
        break;
      case 'alpha':
        {
          this._props.alpha = value;
          if (this._widget)
            this._widget.setProperty(hmUI.prop.MORE, {
              ...this.size,
              ...this.position,
              ...this._props,
            });
        }
        break;
    }
  }
}

export declare interface NativeWidgetRadioGroupAttributes {
  // defaultChecked: number;
  // stateButton: NativeWidgetStateButton[];
  select_src: string;
  unselect_src: string;
}

export declare interface NativeWidgetStateButtonAttributes {
  r?: number;
  radius?: number;
  color?: number;
  alpha?: number;
}