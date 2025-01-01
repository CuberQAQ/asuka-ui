import { RenderNodeProxy, RenderNodeWithMultiChildren, } from '../../core/base.js';
import { Axis, Constraints, CrossAxisAlignment, FlexFit, HorizontalDirection, MainAxisAlignment, MainAxisSize, VerticalDirection, flipAxis, } from '../../core/layout.js';
import { assert } from '../../debug/index.js';
import { max } from '../../tools/index.js';
export class LayoutWidgetFlex extends RenderNodeWithMultiChildren {
    _direction = Axis.vertical;
    _mainAxisAlignment = MainAxisAlignment.start;
    _mainAxisSize = MainAxisSize.max;
    _crossAxisAlignment = CrossAxisAlignment.center;
    _horizonDirection = HorizontalDirection.ltr;
    _verticalDirection = VerticalDirection.down;
    _textBaseline = null; // not support now
    _overflow = 0;
    sizedByParent = false;
    setProperty(key, value) {
        switch (key) {
            case 'd':
            case 'direction':
                {
                    if (value !== this._direction) {
                        this._direction = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'maa':
            case 'mainAxisAlignment':
                {
                    if (value !== this._mainAxisAlignment) {
                        this._mainAxisAlignment = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'mas':
            case 'mainAxisSize':
                {
                    if (value !== this._mainAxisSize) {
                        this._mainAxisSize = value;
                        if (this._mainAxisSize === MainAxisSize.max) {
                            this.sizedByParent = true;
                            this.markSizedByParentChanged();
                        }
                        else {
                            this.sizedByParent = false;
                            this.markSizedByParentChanged();
                        }
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'caa':
            case 'crossAxisAlignment':
                {
                    if (value !== this._crossAxisAlignment) {
                        this._crossAxisAlignment = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'hd':
            case 'horizonDirection':
                {
                    if (value !== this._horizonDirection) {
                        this._horizonDirection = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'vd':
            case 'verticalDirection':
                {
                    if (value !== this._verticalDirection) {
                        this._verticalDirection = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'tb':
            case 'textBaseline':
                {
                    if (value !== this._textBaseline) {
                        this._textBaseline = value;
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
    /**
     * sizedByParent == true，即_mainAxisSize == MainAxisSize.max时的布局
     *
     * 直接maxSize就完事儿了
     */
    performResize() {
        assert(this._constraints != null);
        this.size = this._constraints.biggest;
    }
    _getFlex(child) {
        return child instanceof LayoutWidgetFlexible ? child._flex : 0;
    }
    _getFit(child) {
        return child instanceof LayoutWidgetFlexible ? child._fit : FlexFit.tight;
    }
    _getMainSize(size) {
        return this._direction === Axis.horizontal ? size.w : size.h;
    }
    _getCrossSize(size) {
        return this._direction === Axis.horizontal ? size.h : size.w;
    }
    _startIsTopLeft(direction) {
        // If the relevant value of textDirection or verticalDirection is null, this returns null too.
        switch (direction) {
            case Axis.horizontal:
                switch (this._horizonDirection) {
                    case HorizontalDirection.ltr:
                        return true;
                    case HorizontalDirection.rtl:
                        return false;
                    case null:
                        return null;
                }
            case Axis.vertical:
                switch (this._verticalDirection) {
                    case VerticalDirection.down:
                        return true;
                    case VerticalDirection.up:
                        return false;
                    case null:
                        return null;
                }
        }
    }
    _computeSizes() {
        const constraints = this._constraints;
        let totalFlex = 0;
        const maxMainSize = this._direction === Axis.horizontal
            ? constraints.maxWidth
            : constraints.maxHeight;
        const canFlex = maxMainSize < Number.POSITIVE_INFINITY;
        let crossSize = 0;
        // Sum of the sizes of the non-flexible children
        let allocatedSize = 0;
        let lastFlexChild = null;
        // calculate children size, get crossSize and allcotedsSize
        this.visitChildren((child) => {
            let flex = this._getFlex(child);
            if (flex > 0) {
                totalFlex += flex;
                lastFlexChild = child;
            }
            else {
                let innerConstraints;
                if (this._crossAxisAlignment === CrossAxisAlignment.stretch) {
                    switch (this._direction) {
                        case Axis.horizontal:
                            innerConstraints = Constraints.createTight({
                                h: constraints.maxHeight,
                            });
                            break;
                        case Axis.vertical:
                            innerConstraints = Constraints.createTight({
                                w: constraints.maxWidth,
                            });
                            break;
                    }
                }
                else {
                    switch (this._direction) {
                        case Axis.horizontal:
                            innerConstraints = new Constraints({
                                maxHeight: constraints.maxHeight,
                            });
                            break;
                        case Axis.vertical:
                            innerConstraints = new Constraints({
                                maxWidth: constraints.maxWidth,
                            });
                            break;
                    }
                }
                // layout child
                child.layout(innerConstraints, {
                    parentUsesSize: true,
                    widgetFactory: this._widgetFactory,
                });
                assert(child.size != null);
                let childSize = child.size;
                allocatedSize += this._getMainSize(childSize);
                crossSize += max(crossSize, this._getCrossSize(childSize));
            }
        });
        // Distribute free space to flexible children
        let freeSpace = max(0, (canFlex ? maxMainSize : 0.0) - allocatedSize);
        let allocatedFlexSpace = 0;
        if (totalFlex > 0) {
            let spacePerFlex = canFlex ? freeSpace / totalFlex : NaN;
            this.visitChildren((child) => {
                let flex = this._getFlex(child);
                if (flex > 0) {
                    let maxChildExtent = canFlex
                        ? child == lastFlexChild
                            ? freeSpace - allocatedFlexSpace
                            : spacePerFlex * flex
                        : Number.POSITIVE_INFINITY;
                    let minChildExtent;
                    switch (this._getFit(child)) {
                        case FlexFit.tight:
                            assert(maxChildExtent < Number.POSITIVE_INFINITY);
                            minChildExtent = maxChildExtent;
                            break;
                        case FlexFit.loose:
                            minChildExtent = 0;
                            break;
                    }
                    let innerConstraints;
                    if (this._crossAxisAlignment === CrossAxisAlignment.stretch) {
                        switch (this._direction) {
                            case Axis.horizontal:
                                innerConstraints = new Constraints({
                                    minWidth: minChildExtent,
                                    maxWidth: maxChildExtent,
                                    minHeight: constraints.maxHeight,
                                    maxHeight: constraints.maxHeight,
                                });
                                break;
                            case Axis.vertical:
                                innerConstraints = new Constraints({
                                    minWidth: constraints.maxWidth,
                                    maxWidth: constraints.maxWidth,
                                    minHeight: minChildExtent,
                                    maxHeight: maxChildExtent,
                                });
                                break;
                        }
                    }
                    else {
                        switch (this._direction) {
                            case Axis.horizontal:
                                innerConstraints = new Constraints({
                                    minWidth: minChildExtent,
                                    maxWidth: maxChildExtent,
                                    maxHeight: constraints.maxHeight,
                                });
                                break;
                            case Axis.vertical:
                                innerConstraints = new Constraints({
                                    maxWidth: constraints.maxWidth,
                                    minHeight: minChildExtent,
                                    maxHeight: maxChildExtent,
                                });
                                break;
                        }
                    }
                    child.layout(innerConstraints, {
                        parentUsesSize: true,
                        widgetFactory: this._widgetFactory,
                    });
                    assert(child.size != null);
                    const childSize = child.size;
                    const childMainSize = this._getMainSize(childSize);
                    assert(childMainSize <= maxChildExtent);
                    allocatedSize += childMainSize;
                    allocatedFlexSpace += maxChildExtent;
                    crossSize = max(crossSize, this._getCrossSize(childSize));
                }
            });
        }
        const idealSize = canFlex && this._mainAxisSize == MainAxisSize.max
            ? maxMainSize
            : allocatedSize;
        return {
            mainSize: idealSize,
            crossSize: crossSize,
            allocatedSize: allocatedSize,
        };
    }
    performLayout() {
        assert(this._widgetFactory != null);
        assert(this._constraints != null);
        const constraints = this._constraints;
        let { mainSize: actualSize, crossSize, allocatedSize, } = this._computeSizes();
        // baseline support
        switch (this._direction) {
            case Axis.horizontal:
                this.size = constraints.constrain({ w: actualSize, h: crossSize });
                actualSize = this.size.w;
                crossSize = this.size.h;
                break;
            case Axis.vertical:
                this.size = constraints.constrain({ w: crossSize, h: actualSize });
                actualSize = this.size.h;
                crossSize = this.size.w;
                break;
        }
        const actualSizeDelta = actualSize - allocatedSize;
        this._overflow = max(0, -actualSizeDelta);
        const remainingSpace = max(0, actualSizeDelta);
        let leadingSpace;
        let betweenSpace;
        // flipMainAxis is used to decide whether to lay out
        // left-to-right/top-to-bottom (false), or right-to-left/bottom-to-top
        // (true). The _startIsTopLeft will return null if there's only one child
        // and the relevant direction is null, in which case we arbitrarily decide
        // to flip, but that doesn't have any detectable effect.
        const flipMainAxis = !(this._startIsTopLeft(this._direction) ?? true);
        switch (this._mainAxisAlignment) {
            case MainAxisAlignment.start:
                leadingSpace = 0.0;
                betweenSpace = 0.0;
                break;
            case MainAxisAlignment.end:
                leadingSpace = remainingSpace;
                betweenSpace = 0.0;
                break;
            case MainAxisAlignment.center:
                leadingSpace = remainingSpace / 2.0;
                betweenSpace = 0.0;
                break;
            case MainAxisAlignment.spaceBetween:
                leadingSpace = 0.0;
                betweenSpace =
                    this.childRenderNodeCount > 1
                        ? remainingSpace / (this.childRenderNodeCount - 1)
                        : 0.0;
                break;
            case MainAxisAlignment.spaceAround:
                betweenSpace =
                    this.childRenderNodeCount > 0
                        ? remainingSpace / this.childRenderNodeCount
                        : 0.0;
                leadingSpace = betweenSpace / 2.0;
                break;
            case MainAxisAlignment.spaceEvenly:
                betweenSpace =
                    this.childRenderNodeCount > 0
                        ? remainingSpace / (this.childRenderNodeCount + 1)
                        : 0.0;
                leadingSpace = betweenSpace;
                break;
        }
        // Position elements
        let childMainPosition = flipMainAxis
            ? actualSize - leadingSpace
            : leadingSpace;
        this.visitChildren((child) => {
            assert(child.size != null);
            let childCrossPosition = 0;
            switch (this._crossAxisAlignment) {
                case CrossAxisAlignment.start:
                case CrossAxisAlignment.end:
                    childCrossPosition =
                        this._startIsTopLeft(flipAxis(this._direction)) ===
                            (this._crossAxisAlignment === CrossAxisAlignment.start)
                            ? 0.0
                            : crossSize - this._getCrossSize(child.size);
                    break;
                case CrossAxisAlignment.center:
                    childCrossPosition =
                        (crossSize - this._getCrossSize(child.size)) / 2.0;
                    break;
                case CrossAxisAlignment.stretch:
                    childCrossPosition = 0.0;
                    break;
                // case CrossAxisAlignment.baseline:
                //   if (_direction == Axis.horizontal) {
                //     assert(textBaseline != null);
                //     final double? distance = child.getDistanceToBaseline(textBaseline!, onlyReal: true);
                //     if (distance != null) {
                //       childCrossPosition = maxBaselineDistance - distance;
                //     } else {
                //       childCrossPosition = 0.0;
                //     }
                //   } else {
                //     childCrossPosition = 0.0;
                //   }
                // break;
                default:
                    assert(() => {
                        throw Error('Unknown CrossAxisAlignment in Flex performLayout');
                    });
            }
            if (flipMainAxis) {
                childMainPosition -= this._getMainSize(child.size);
            }
            switch (this._direction) {
                case Axis.horizontal:
                    child.offset = { x: childMainPosition, y: childCrossPosition };
                    break;
                case Axis.vertical:
                    child.offset = { x: childCrossPosition, y: childMainPosition };
                    break;
            }
            if (flipMainAxis) {
                childMainPosition -= betweenSpace;
            }
            else {
                childMainPosition += this._getMainSize(child.size) + betweenSpace;
            }
        });
    }
    performCommit() { }
}
export class LayoutWidgetFlexible extends RenderNodeProxy {
    _fit = FlexFit.loose;
    _flex = 1;
    onMount() {
        assert(() => {
            if (!(this.parentNode instanceof LayoutWidgetFlex)) {
                throw Error('The Parent Node of a LayoutWidgetFlexible widget must be instance of LayoutWidgetFlex');
            }
            return true;
        });
    }
    setProperty(key, value) {
        super.setProperty(key, value);
        switch (key) {
            case 'flex':
                {
                    if (value !== this._flex) {
                        this._flex = value;
                        this.markNeedsLayout();
                    }
                }
                break;
            case 'fit':
                {
                    if (value !== this._fit) {
                        this._fit = value;
                        this.markNeedsLayout();
                    }
                }
                break;
        }
    }
}
export class LayoutWidgetExpanded extends LayoutWidgetFlexible {
    _fit = FlexFit.tight;
}
//# sourceMappingURL=flex.js.map