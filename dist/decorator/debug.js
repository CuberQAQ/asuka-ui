/**
 * **（类装饰器）为类方法添加调用开始和结束回显**
 * @param originalMethod 操作的方法
 * @param context
 * @returns
 */
export function log(printArgs = false, logger = console.log) {
    return (originalMethod, context) => {
        const methodName = String(context.name);
        function replacementMethod(...args) {
            printArgs
                ? logger(`LOG: Entering method '${methodName}'，args=`, ...args)
                : logger(`LOG: Entering method '${methodName}'.`);
            const result = originalMethod.call(this, ...args);
            logger(`LOG: Exiting method '${methodName}'.`);
            return result;
        }
        return replacementMethod;
    };
}
/**
 * **（类装饰器）显示字符串标签 在toString时显示[object 类名]而非[object Object]**
 * @param value 操作的类
 * @param context
 */
export function objectTag(value, context) {
    if (context.kind === 'class') {
        value.prototype[Symbol.toStringTag] = context.name;
    }
}
//# sourceMappingURL=debug.js.map