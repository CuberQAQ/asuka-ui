/**
 * **向数组中插入或删除一个元素**
 * @description
 * 指定了`add`参数时，将`add`插入到数组`arr`中指定元素`ref`的前面；若未指定`add`，则从`arr`中删除元素`ref`
 * @param arr 操作的数组
 * @param ref 要删除的元素 或者 要插入元素的后面的元素
 * @param add 要插入的元素
 * @param byValueOnly 返回值为
 * @returns 操作失败时，返回`-1`；否则当
 */
export function splice(arr, ref, add, byValueOnly) {
    let i = (arr ? findWhere(arr, ref, true, byValueOnly) : -1);
    if (~i)
        add ? arr.splice(i, 0, add) : arr.splice(i, 1); // TODO if i != -1
    return i;
}
/**
 * **从数组中查找指定的元素**
 * @param arr 操作的数组
 * @param ref 要查找的元素 或 一个判断元素是否为要查找元素的函数；
 * @param returnIndex 返回要查找的元素的数组索引还是元素本身
 * @param byValueOnly 当`ref`为函数时，将此项设为`true`以将`ref`视为数组元素而非查找函数
 * @returns 当`returnIndex`为true时，返回目标元素的数组索引，不存在则返回`-1`；当`returnIndex`为`false`时，返回目标元素本身，不存在则返回`undefined`
 */
export function findWhere(arr, ref, returnIndex, byValueOnly) {
    let i = arr.length;
    while (i--)
        if (typeof ref !== 'function' || byValueOnly
            ? arr[i] === ref
            : ref(arr[i]))
            break;
    return returnIndex ? i : arr[i];
}
// export function createAttributeFilter(ns: string, name: string) {
//   return (o: any) => o.ns === ns && toLower(o.name) === toLower(name);
// }
export function isElement(node) {
    return node.nodeType === 1;
}
export function isTextNode(node) {
    return node.nodeType === 3;
}
export function parseDimension(v) {
    if (typeof v === 'string') {
        if (v.endsWith('px')) {
            return Number(v.slice(0, -2));
        }
        throw new Error('unknown type. parseDimension failed');
    }
    else
        return v;
}
//# sourceMappingURL=utils.js.map