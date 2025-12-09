import { RenderNodeWithMultiChildren, RenderWidget, } from '../../../core/base.js';
import { Constraints, Coordinate, Size } from '../../../core/layout.js';
import { PerformTimer } from '../../../debug/index.js';
import { timeit } from '../../../decorator/debug.js';
import { PreferSizeManager, } from '../../../tools/widget.js';
export class LiteWidget extends RenderWidget {
    __size = { w: 0, h: 0 };
    __position = { x: 0, y: 0 };
    constructor(nodeType, nodeName) {
        // setup relayoutBoundary
        super(nodeType, nodeName);
        this._relayoutBoundary = this;
    }
    performResize() { }
    performLayout() {
        this.size = this.__size;
    }
    setProperty(key, value) {
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
export class LiteBlock extends RenderNodeWithMultiChildren {
    _preferSizeManager = new PreferSizeManager(this);
    __position = { x: 0, y: 0 };
    constructor(nodeType, nodeName) {
        super(nodeType, nodeName);
        this._preferSizeManager._defaultSize = Size.infinite;
    }
    onMount() {
        super.onMount();
        // setup relayoutBoundary
        if (this.parentNode instanceof LiteBlock) {
            this._relayoutBoundary = this;
        }
    }
    performResize() { }
    performCommit() { }
    @timeit()
    performLayout() {
        const perf = new PerformTimer('LiteBlock');
        this._preferSizeManager.chooseSize();
        perf.record('start');
        this.visitChildren((child) => {
            child.layout(new Constraints({}), {
                parentUsesSize: false,
                widgetFactory: this._widgetFactory,
            });
            child.offset = child.__position ?? Coordinate.origin();
            perf.record('child');
        });
    }
    setProperty(key, value) {
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
//# sourceMappingURL=lite-widget.js.map