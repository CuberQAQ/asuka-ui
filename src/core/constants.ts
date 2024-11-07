import { AsukaNode } from './base.js';

export const NodeType = {
  TEXT_NODE: 1,
  RENDER_NODE: 2,
  UNKNOWN_NODE: 4,
};

export function isRenderNode(node: AsukaNode | null) {
  return node === null ? false : node.nodeType === NodeType.RENDER_NODE;
}

export function isTextNode(node: AsukaNode | null) {
  return node === null ? false : node.nodeType === NodeType.TEXT_NODE;
}
