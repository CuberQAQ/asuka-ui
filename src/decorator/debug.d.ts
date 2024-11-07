/**
 * **（类装饰器）为类方法添加调用开始和结束回显**
 * @param originalMethod 操作的方法
 * @param context
 * @returns
 */
export declare function log(printArgs?: boolean, logger?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): (originalMethod: any, context: ClassMethodDecoratorContext) => (this: any, ...args: any[]) => any;
/**
 * **（类装饰器）显示字符串标签 在toString时显示[object 类名]而非[object Object]**
 * @param value 操作的类
 * @param context
 */
export declare function objectTag(value: Function, context: ClassDecoratorContext): void;
//# sourceMappingURL=debug.d.ts.map