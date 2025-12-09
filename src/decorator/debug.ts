/**
 * **（类装饰器）为类方法添加调用开始和结束回显**
 * @param originalMethod 操作的方法
 * @param context
 * @returns
 */
export function log(printArgs: boolean = false, logger = console.log) {
  return (originalMethod: any, context: ClassMethodDecoratorContext) => {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
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
 * **（类装饰器）为类方法计算调用用时**
 * @param originalMethod 操作的方法
 * @param context
 * @returns
 */
export function timeit(props: { printArgs?: boolean; logger?: any, extra?: string, silent?: boolean } = {}) {
  const { printArgs = false, logger = console.log, extra="" } = props;
  return (originalMethod: any, context: ClassMethodDecoratorContext) => {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      // printArgs
      //   ? logger(`[TIMEIT] Entering '${methodName}' ${extra}, args=`, ...args)
      //   : logger(`[TIMEIT] Entering '${methodName}' ${extra}.`);
      const startTime = Date.now();
      const result = originalMethod.call(this, ...args);

      // get class name
      const className = this.constructor.name;
      this.__time = Date.now() - startTime;
      !props.silent && logger(
        `[TIMEIT]: Exiting '${className}#${methodName}' ${extra}. Time: ${Date.now() - startTime}ms`,
      );
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
export function objectTag(value: Function, context: ClassDecoratorContext) {
  if (context.kind === 'class') {
    value.prototype[Symbol.toStringTag] = context.name;
  }
}
