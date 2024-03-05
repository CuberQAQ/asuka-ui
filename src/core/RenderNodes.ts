import { assert } from '../debug/index';
import { AsukaNode, RenderNode } from './AsukaDOM';
import { isRenderNode } from './constants';

export abstract class RenderNodeWithNoChild extends RenderNode {
  get firstChild(): AsukaNode | null {
    return null;
  }
  visitChildren(handler: (child: RenderNode) => void): void {
    return;
  }
  unmountChild(child: AsukaNode): boolean {
    return false;
  }
  mountChild(child: AsukaNode, ref?: AsukaNode | undefined): boolean {
    return false;
  }
  getChildNextSibling(child: AsukaNode): AsukaNode | null {
    return null;
  }
}

export abstract class RenderNodeWithSingleChild extends RenderNode {
  _child: AsukaNode | null = null;
  set child(child: AsukaNode | null) {
    if (this._child) {
      this.unmountChild(this._child);
      this._child = null;
    }
    if (child != null) this.mountChild(child);
  }
  get child() {
    return this._child;
  }
  get firstChild(): AsukaNode | null {
    return this._child;
  }
  visitChildren(handler: (child: RenderNode) => void): void {
    if (isRenderNode(this._child)) {
      handler(this._child! as RenderNode);
    }
  }
  unmountChild(child: AsukaNode): boolean {
    if (this._child !== null && child === this._child) {
      this._setupUnmountingChild(child);
      this._child = null;
      return true;
    }
    return false;
  }
  mountChild(child: AsukaNode): boolean {
    if (this._child !== null) return false;
    this._child = child;
    this._setupMountingChild(child);
    return true;
  }
  getChildNextSibling(child: AsukaNode): AsukaNode | null {
    return null;
  }
}

/**
 * **可包含多个子节点的RenderNode**
 *
 * 通过双向链表存储子结构
 */
export abstract class RenderNodeWithMultiChildren extends RenderNode {
  _firstChild: AsukaNode | null = null;
  _lastChild: AsukaNode | null = null;

  get firstChild(): AsukaNode | null {
    return this._firstChild;
  }
  visitChildren(handler: (child: RenderNode) => void): void {
    let nowChild = this._firstChild;
    while (nowChild) {
      if (isRenderNode(nowChild)) handler(nowChild as RenderNode);
      assert(nowChild.parentData.nextSibling !== undefined); // 为null或者AsukaNode
      nowChild = nowChild.parentData.nextSibling;
    }
  }
  unmountChild(child: AsukaNode): boolean {
    if (child.parentNode !== this) return false;
    let previousSibling = child.parentData.previousSibling as AsukaNode | null;
    let nextSibling = child.parentData.nextSibling as AsukaNode | null;
    if (previousSibling) previousSibling.parentData.nextSibling = nextSibling;
    if (nextSibling) nextSibling.parentData.previousSibling = previousSibling;
    if (child === this._firstChild) {
      this._firstChild = child.parentData.nextSibling;
    }
    if (child === this._lastChild) {
      this._lastChild = child.parentData.previousSibling;
    }
    this._setupUnmountingChild(child);
    return true;
  }
  mountChild(child: AsukaNode, ref?: AsukaNode | undefined): boolean {
    assert(!child.parentNode);
    if (ref) {
      if (ref.parentNode !== this) return false;
      this._setupMountingChild(child)
      let previousSibling = ref.parentData.previousSibling as AsukaNode | null;
      child.parentData.previousSibling = previousSibling
      ref.parentData.previousSibling = child
      if(previousSibling) previousSibling.parentData.nextSibling = child;
      if(ref === this._firstChild) this._firstChild = child;
      return true;
    } else {
      this._setupMountingChild(child)
      let lastChild = this._lastChild
      this._lastChild = child
      child.parentData.previousSibling = lastChild
      if(lastChild) lastChild.parentData.nextSibling = child
      else this._firstChild = child
      return true;
    }
  }
  getChildNextSibling(child: AsukaNode): AsukaNode | null {
    return child.parentData.nextSibling;
  }
}
