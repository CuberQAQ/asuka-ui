import {
  RenderNodeWithMultiChildren,
  RenderWidget,
  WidgetFactory,
} from '../../../core/base.js';
import { Constraints, Coordinate, Size } from '../../../core/layout.js';
import { PerformTimer } from '../../../debug/index.js';
import { timeit } from '../../../decorator/debug.js';
import {
  PreferSizeAttributesMixin,
  PreferSizeManager,
} from '../../../tools/widget.js';

interface LiteNode {
  __position: Coordinate;
}

export abstract class LiteWidget extends RenderWidget implements LiteNode {
  __size: Size = { w: 0, h: 0 };
  __position: Coordinate = { x: 0, y: 0 };
  constructor(nodeType: number | null, nodeName: string) {
    // setup relayoutBoundary
    super(nodeType, nodeName);
    this._relayoutBoundary = this;
  }
  performResize(): void {}
  performLayout(): void {
    this.size = this.__size;
  }

  setProperty(key: string, value: any): void {
    // super.setProperty(key, value);
    switch (key) {
      case 'x':
        this.__position.x = value;
        this.markNeedsLayout();
        break;
      case 'y':
        this.__position.y = value;
        this.markNeedsLayout();
        break;
      case 'w':
        this.__size.w = value;
        this.markNeedsLayout();
        break;
      case 'h':
        this.__size.h = value;
        this.markNeedsLayout();
        break;
    }
  }
}

export class LiteBlock extends RenderNodeWithMultiChildren implements LiteNode {
  _preferSizeManager = new PreferSizeManager(this);
  __position: Coordinate = { x: 0, y: 0 };
  constructor(nodeType: number | null, nodeName: string) {
    super(nodeType, nodeName);
    this._preferSizeManager._defaultSize = Size.infinite;
  }
  onMount(): void {
    super.onMount();
    // setup relayoutBoundary
    if(this.parentNode instanceof LiteBlock) {
      this._relayoutBoundary = this;
    }
  }
  performResize(): void {}
  performCommit(): void {}
  @timeit()
  performLayout(): void {
    const perf = new PerformTimer('LiteBlock');
    this._preferSizeManager.chooseSize();
    perf.record('start');
    this.visitChildren((child) => {
      child.layout(new Constraints({}), {
        parentUsesSize: false,
        widgetFactory: this._widgetFactory!,
      });

      child.offset = (child as any).__position ?? Coordinate.origin();
      perf.record('child');
    });
  }
  setProperty(key: string, value: any): void {
    // super.setProperty(key, value);
    this._preferSizeManager.setProperty(key, value);
    switch (key) {
      case 'x':
        this.__position.x = value;
        this.markNeedsLayout();
        break;
      case 'y':
        this.__position.y = value;
        this.markNeedsLayout();
        break;
    }
  }
}

export declare interface LiteWidgetAttributes {
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export declare interface LiteBlockAttributes extends PreferSizeAttributesMixin {
  x?: number;
  y?: number;
}
