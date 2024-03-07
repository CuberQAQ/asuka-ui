import { createRenderer } from 'solid-js/universal';
import {
  AsukaNode,
  AsukaTextNode,
  AsukaUI,
  AsukaUnknownNode,
  RenderView,
  isTextNode,
} from '../core';

const PROPERTIES = new Set(['classNames', 'textContent']);
export function createViewRenderer(core: AsukaUI) {
  return createRenderer({
    createElement(type) {
      let el: AsukaNode | null = core.createNode(type);
      if (el === null) el = new AsukaUnknownNode();
      return el as AsukaNode;
    },
    createTextNode(text) {
      return core.createTextNode(text);
    },
    replaceText(node, text) {
      if (isTextNode(node)) {
        (node as AsukaTextNode).data = text;
      }
    },
    insertNode(parent, node, anchor) {
      parent.mountChild(node, anchor);
    },
    removeNode(parent, node) {
      parent.unmountChild(node);
    },
    setProperty(node, name, value) {
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
}
