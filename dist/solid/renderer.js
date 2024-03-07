import { createRenderer } from 'solid-js/universal';
import { AsukaUnknownNode, isTextNode, } from '../core';
const PROPERTIES = new Set(['classNames', 'textContent']);
export function createViewRenderer(core) {
    return createRenderer({
        createElement(type) {
            let el = core.createNode(type);
            if (el === null)
                el = new AsukaUnknownNode();
            return el;
        },
        createTextNode(text) {
            return core.createTextNode(text);
        },
        replaceText(node, text) {
            if (isTextNode(node)) {
                node.data = text;
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
            let parent = node.parentNode;
            if (parent === null)
                parent = undefined;
            return parent;
        },
        getFirstChild(node) {
            let child = node.firstChild;
            if (child === null)
                child = undefined;
            return child;
        },
        getNextSibling(node) {
            let next = node.nextSibling;
            if (next === null)
                next = undefined;
            return next;
        },
    });
}
//# sourceMappingURL=renderer.js.map