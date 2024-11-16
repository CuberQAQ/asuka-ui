import { createRenderer as _createRenderer } from 'solid-js/universal';
import {
  AsukaNode,
  AsukaTextNode,
  AsukaUI,
  AsukaUnknownNode,
  isTextNode,
  assert,
} from './index.js';

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
} = _createRenderer({
  createElement(type) {
    console.log(`[AsukaUI] createElement type=${type}`);
    assert(AsukaUI.instance != null);
    let core = AsukaUI.instance!;
    let el: AsukaNode | null = core.createNode(type);
    if (el === null) el = new AsukaUnknownNode();
    return el as AsukaNode;
  },
  createTextNode(text) {
    assert(AsukaUI.instance != null);
    let core = AsukaUI.instance!;
    return core.createTextNode(text);
  },
  replaceText(node, text) {
    if (isTextNode(node)) {
      (node as AsukaTextNode).data = text;
    }
  },
  insertNode(parent, node, anchor) {
    console.log(`[AsukaUI] insertNode parent=${parent.nodeName} node=${node.nodeName} anchor=${anchor?.nodeName}`);

    parent.mountChild(node, anchor);
  },
  removeNode(parent, node) {
    console.log(`[AsukaUI] removeNode parent=${parent.nodeName} node=${node.nodeName}`);
    parent.unmountChild(node);
  },
  setProperty(node, name, value) {
    console.log(`[AsukaUI] setProperty node=${node.nodeName} name=${name} value=${value}`);
    //   if (name === 'style') Object.assign(node.style, value);
    //   else if (name.startsWith('on')) node[name.toLowerCase()] = value;
    //   else if (PROPERTIES.has(name)) node[name] = value;
    //   else node.setAttribute(name, value);
    node.setProperty(name, value);
  },
  isTextNode(node) {
    return isTextNode(node);
  },
  getParentNode(node) {
    let parent: AsukaNode | null | undefined = node.parentNode;
    if (parent === null) parent = undefined;
    return parent;
  },
  getFirstChild(node) {
    let child: AsukaNode | null | undefined = node.firstChild;
    if (child === null) child = undefined;
    return child;
  },
  getNextSibling(node) {
    let next: AsukaNode | null | undefined = node.nextSibling;
    if (next === null) next = undefined;
    return next;
  },
});

export * from 'solid-js';
export * as store from 'solid-js/store'
// export * from '@cuberqaq/asuka-ui';
// export function createRenderer() {
//   return _createRenderer({
//     createElement(type) {
//       assert(AsukaUI.instance != null);
//       let core = AsukaUI.instance!;
//       let el: AsukaNode | null = core.createNode(type);
//       if (el === null) el = new AsukaUnknownNode();
//       return el as AsukaNode;
//     },
//     createTextNode(text) {
//       assert(AsukaUI.instance != null);
//       let core = AsukaUI.instance!;
//       return core.createTextNode(text);
//     },
//     replaceText(node, text) {
//       if (isTextNode(node)) {
//         (node as AsukaTextNode).data = text;
//       }
//     },
//     insertNode(parent, node, anchor) {
//       parent.mountChild(node, anchor);
//     },
//     removeNode(parent, node) {
//       parent.unmountChild(node);
//     },
//     setProperty(node, name, value) {
//       //   if (name === 'style') Object.assign(node.style, value);
//       //   else if (name.startsWith('on')) node[name.toLowerCase()] = value;
//       //   else if (PROPERTIES.has(name)) node[name] = value;
//       //   else node.setAttribute(name, value);
//       console.log('awawa');

//       node.setProperty(name, value);
//     },
//     isTextNode(node) {
//       return isTextNode(node);
//     },
//     getParentNode(node) {
//       let parent: AsukaNode | null | undefined = node.parentNode;
//       if (parent === null) parent = undefined;
//       return parent;
//     },
//     getFirstChild(node) {
//       let child: AsukaNode | null | undefined = node.firstChild;
//       if (child === null) child = undefined;
//       return child;
//     },
//     getNextSibling(node) {
//       let next: AsukaNode | null | undefined = node.nextSibling;
//       if (next === null) next = undefined;
//       return next;
//     },
//   });
// }
