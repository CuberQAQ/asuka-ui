export function range(start, end, step = 1) {
    if (step == 0)
        return [];
    if (start <= end && step > 0) {
        let arr = [];
        for (let i = start; i <= end; i += step)
            arr.push(i);
        return arr;
    }
    else if (start >= end && step < 0) {
        let arr = [];
        for (let i = start; i >= end; i += step)
            arr.push(i);
        return arr;
    }
    else
        return [];
}
//# sourceMappingURL=range.js.map