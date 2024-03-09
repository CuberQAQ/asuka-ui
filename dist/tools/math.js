export function min(a, b) {
    return a <= b ? a : b;
}
export function max(a, b) {
    return a >= b ? a : b;
}
export function randomRange(start, end) {
    if (start > end) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    return Math.random() * (end - start) + start;
}
//# sourceMappingURL=math.js.map