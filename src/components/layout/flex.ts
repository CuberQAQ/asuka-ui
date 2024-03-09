import { isRenderNode } from '../../core';
import {
  AsukaNode,
  RenderNode,
  RenderNodeProxy,
  RenderNodeWithMultiChildren,
  RenderNodeWithSingleChild,
} from '../../core/base';
import {
  Axis,
  Constraints,
  Coordinate,
  CrossAxisAlignment,
  FlexFit,
  HorizontalDirection,
  MainAxisAlignment,
  MainAxisSize,
  Size,
  TextBaseline,
  VerticalDirection,
  flipAxis,
} from '../../core/layout';
import { assert } from '../../debug/index';
import { max, min } from '../../tools';

export class LayoutWidgetFlex extends RenderNodeWithMultiChildren {
  _direction: Axis = Axis.vertical;
  _mainAxisAlignment: MainAxisAlignment = MainAxisAlignment.start;
  _mainAxisSize: MainAxisSize = MainAxisSize.max;
  _crossAxisAlignment: CrossAxisAlignment = CrossAxisAlignment.center;
  _horizonDirection: HorizontalDirection = HorizontalDirection.ltr;
  _verticalDirection: VerticalDirection = VerticalDirection.down;
  _textBaseline: TextBaseline | null = null; // not support now
  _overflow: number = 0;
  sizedByParent: boolean = false;
  setProperty(key: string, value: any): void {
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
            } else {
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
  performResize(): void {
    assert(this._constraints != null);
    this.size = this._constraints!.biggest;
  }
  _getFlex(child: RenderNode): number {
    return child instanceof LayoutWidgetFlexible ? child._flex : 0;
  }
  _getFit(child: RenderNode): FlexFit {
    return child instanceof LayoutWidgetFlexible ? child._fit : FlexFit.tight;
  }
  _getMainSize(size: Size) {
    return this._direction === Axis.horizontal ? size.w : size.h;
  }
  _getCrossSize(size: Size) {
    return this._direction === Axis.horizontal ? size.h : size.w;
  }
  _startIsTopLeft(direction: Axis): boolean | null {
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
    const constraints = this._constraints!;
    let totalFlex: number = 0;
    const maxMainSize =
      this._direction === Axis.horizontal
        ? constraints.maxWidth
        : constraints.maxHeight;
    const canFlex: boolean = maxMainSize < Number.POSITIVE_INFINITY;

    let crossSize: number = 0;
    // Sum of the sizes of the non-flexible children
    let allocatedSize: number = 0;
    let lastFlexChild: LayoutWidgetFlexible | null = null;
    // calculate children size, get crossSize and allcotedsSize
    this.visitChildren((child) => {
      let flex = this._getFlex(child);
      if (flex > 0) {
        totalFlex += flex;
        lastFlexChild = child as LayoutWidgetFlexible;
      } else {
        let innerConstraints: Constraints;
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
        } else {
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
          widgetFactory: this._widgetFactory!,
        });
        assert(child.size != null);
        let childSize: Size = child.size!;
        allocatedSize += this._getMainSize(childSize);
        crossSize += max(crossSize, this._getCrossSize(childSize));
      }
    });

    // Distribute free space to flexible children
    let freeSpace: number = max(
      0,
      (canFlex ? maxMainSize : 0.0) - allocatedSize,
    );
    let allocatedFlexSpace = 0;
    if (totalFlex > 0) {
      let spacePerFlex: number = canFlex ? freeSpace / totalFlex : NaN;
      this.visitChildren((child) => {
        let flex = this._getFlex(child);
        if (flex > 0) {
          let maxChildExtent: number = canFlex
            ? child == lastFlexChild
              ? freeSpace - allocatedFlexSpace
              : spacePerFlex * flex
            : Number.POSITIVE_INFINITY;
          let minChildExtent: number;
          switch (this._getFit(child)) {
            case FlexFit.tight:
              assert(maxChildExtent < Number.POSITIVE_INFINITY);
              minChildExtent = maxChildExtent;
              break;
            case FlexFit.loose:
              minChildExtent = 0;
              break;
          }
          let innerConstraints: Constraints;
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
          } else {
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
            widgetFactory: this._widgetFactory!,
          });
          assert(child.size != null);
          const childSize: Size = child.size!;
          const childMainSize: number = this._getMainSize(childSize);
          assert(childMainSize <= maxChildExtent);
          allocatedSize += childMainSize;
          allocatedFlexSpace += maxChildExtent;
          crossSize = max(crossSize, this._getCrossSize(childSize));
        }
      });
    }

    const idealSize: number =
      canFlex && this._mainAxisSize == MainAxisSize.max
        ? maxMainSize
        : allocatedSize;
    return {
      mainSize: idealSize,
      crossSize: crossSize,
      allocatedSize: allocatedSize,
    };
  }
  performLayout(): void {
    assert(this._widgetFactory != null);
    assert(this._constraints != null);
    const constraints: Constraints = this._constraints!;

    let {
      mainSize: actualSize,
      crossSize,
      allocatedSize,
    } = this._computeSizes();
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
    const actualSizeDelta: number = actualSize - allocatedSize;
    this._overflow = max(0, -actualSizeDelta);
    const remainingSpace = max(0, actualSizeDelta);
    let leadingSpace: number;
    let betweenSpace: number;
    // flipMainAxis is used to decide whether to lay out
    // left-to-right/top-to-bottom (false), or right-to-left/bottom-to-top
    // (true). The _startIsTopLeft will return null if there's only one child
    // and the relevant direction is null, in which case we arbitrarily decide
    // to flip, but that doesn't have any detectable effect.
    const flipMainAxis: boolean = !(
      this._startIsTopLeft(this._direction) ?? true
    );
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
    let childMainPosition: number = flipMainAxis
      ? actualSize - leadingSpace
      : leadingSpace;
    this.visitChildren((child) => {
      assert(child.size != null);
      let childCrossPosition: number = 0;
      switch (this._crossAxisAlignment) {
        case CrossAxisAlignment.start:
        case CrossAxisAlignment.end:
          childCrossPosition =
            this._startIsTopLeft(flipAxis(this._direction)) ===
            (this._crossAxisAlignment === CrossAxisAlignment.start)
              ? 0.0
              : crossSize - this._getCrossSize(child.size!);
          break;
        case CrossAxisAlignment.center:
          childCrossPosition =
            (crossSize - this._getCrossSize(child.size!)) / 2.0;
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
        childMainPosition -= this._getMainSize(child.size!);
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
      } else {
        childMainPosition += this._getMainSize(child.size!) + betweenSpace;
      }
    });
  }
  performCommit(): void {}
}

export class LayoutWidgetFlexible extends RenderNodeProxy {
  _fit: FlexFit = FlexFit.loose;
  _flex: number = 1;
  onMount(): void {
    assert(() => {
      if (!(this.parentNode instanceof LayoutWidgetFlex)) {
        throw Error(
          'The Parent Node of a LayoutWidgetFlexible widget must be instance of LayoutWidgetFlex',
        );
      }
      return true;
    });
  }
  setProperty(key: string, value: any): void {
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
  _fit: FlexFit = FlexFit.tight;
}
export class LayoutWidgetSpacer extends LayoutWidgetExpanded {
  setProperty(key: string, value: any): void {
    if (key === 'flex') assert(value > 0);
    super.setProperty(key, value);
  }
}
