export const NodeType = {
    TEXT_NODE: 1,
    RENDER_NODE: 2,
};
export function isRenderNode(node) {
    return node === null ? false : node.nodeType === NodeType.RENDER_NODE;
}
export function isTextNode(node) {
    return node === null ? false : node.nodeType === NodeType.TEXT_NODE;
}
//# sourceMappingURL=constants.js.map