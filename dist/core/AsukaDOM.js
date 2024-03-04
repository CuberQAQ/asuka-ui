// import { AsukaLayoutNode } from "./asuka-layout";
// import { defineStyleReflection } from "./layout-bridge";
// import { splice, findWhere, createAttributeFilter, isElement } from "./util";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { objectTag } from '../decorator/debug';
import { isElement, splice } from './utils';
import * as hmUI from '@zos/ui';
/**
 * **节点类**
 */
let AsukaNode = (() => {
    let _classDecorators = [objectTag];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AsukaNode = _classThis = class {
        constructor(
        /** 节点类型 */
        nodeType, 
        /** 节点名称 */
        nodeName) {
            this.nodeType = nodeType;
            this.nodeName = nodeName;
        }
    };
    __setFunctionName(_classThis, "AsukaNode");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AsukaNode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AsukaNode = _classThis;
})();
export { AsukaNode };
/**
 * **文字节点类**
 */
let AsukaTextNode = (() => {
    let _classDecorators = [objectTag];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = AsukaNode;
    var AsukaTextNode = _classThis = class extends _classSuper {
        constructor(text) {
            super(3, '#text'); // 3: TEXT_NODE
            this._text = text;
        }
        /**
         * 该文字节点保存的字符串
         */
        set data(text) {
            this._text = text;
        }
        get data() {
            return this._text;
        }
    };
    __setFunctionName(_classThis, "AsukaTextNode");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AsukaTextNode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AsukaTextNode = _classThis;
})();
export { AsukaTextNode };
/**
 * **元素类**
 */
let AsukaElement = (() => {
    let _classDecorators = [objectTag];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = AsukaNode;
    var AsukaElement = _classThis = class extends _classSuper {
        // protected _attributes: {};
        constructor(nodeTyle, nodeName) {
            super(nodeTyle || 1, nodeName); // 1: ELEMENT_NODE
            this._handlers = {};
            /**------------------子节点操作------------------- */
            /** 子节点列表 */
            this.childNodes = [];
        }
        /**------------------属性设置------------------- */
        /**
         * **设置元素属性**
         * @param key 属性键
         * @param value 属性值
         */
        setProperty(key, value) { }
        /**------------------事件处理------------------- */
        /**
         * **添加事件处理器**
         * @param type 事件类型，不区分大小写
         * @param handler 事件处理函数
         */
        addEventListener(type, handler) {
            (this._handlers[type] || (this._handlers[type] = [])).push(handler);
        }
        /**
         * **删除事件处理器**
         * @param type 事件类型，不区分大小写
         * @param handler 事件处理函数
         */
        removeEventListener(type, handler) {
            splice(this._handlers[type], handler, undefined, true);
        }
        /**
         * **触发事件**
         * @description 如果要添加默认操作，请在调用本方法后判断`event.defaultPrevented`并决定是否执行默认操作
         * @param event 事件对象
         * @returns
         */
        dispatchEvent(event) {
            let target = event.target || (event.target = this), cancelable = event.cancelable, handlers, i;
            do {
                event.currentTarget = target;
                handlers = target._handlers && target._handlers[event.type];
                if (handlers)
                    // 从后往前遍历事件处理函数
                    for (i = handlers.length; i--;) {
                        handlers[i].call(target, event);
                        if (cancelable && event._end)
                            break;
                    }
            } while (event.bubbles &&
                !(cancelable && event._stop) &&
                (target = target.parentNode));
            return handlers != null;
        }
        /** 子节点中位于首项的节点 */
        get firstChild() {
            return this.childNodes[0];
        }
        /** 子节点中位于末项的节点 */
        get lastChild() {
            return this.childNodes[this.childNodes.length - 1];
        }
        /** **返回所有元素类型子节点** */
        getChildrenElement() {
            console.log(`call get children`);
            return this.childNodes.filter(isElement);
        }
        /**
         * **添加一个子节点到子节点列表的末端**
         * @param child 要添加的子节点
         * @returns 该子节点本身
         */
        appendChild(child) {
            child.parentNode = this;
            this.childNodes.push(child);
            return child;
        }
        /**
         * **插入一个子节点 或 追加一个子节点到子节点列表末端**
         * @description
         * 指定`ref`时为插入操作，否则为追加操作
         * @param child 要插入或添加的子节点
         * @param ref 要插入的子节点后面的子节点
         * @returns 该子节点本身
         */
        insertBefore(child, ref) {
            child.parentNode = this;
            ref ? splice(this.childNodes, ref, child) : this.appendChild(child);
            return child;
        }
        /**
         * **删除一个子节点**
         * @param child 要删除的子节点
         * @returns 该子节点本身
         */
        removeChild(child) {
            splice(this.childNodes, child);
            return child;
        }
    };
    __setFunctionName(_classThis, "AsukaElement");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AsukaElement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AsukaElement = _classThis;
})();
export { AsukaElement };
/**
 * **事件类**
 * @description
 */
let AsukaEvent = (() => {
    let _classDecorators = [objectTag];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AsukaEvent = _classThis = class {
        /**
         * **创建事件对象**
         * @param type 事件类型，不区分大小写
         * @param opts 事件属性
         * @property `opts.bubbles` 是否为冒泡类型
         * @property `opts.cancelable` 是否为可以取消
         */
        constructor(type, opts) {
            this.type = type;
            /** 该事件是否已被取消继续冒泡传播(当`cancelable`为`true`时有效) */
            this._stop = false;
            /** 该事件是否已被立即取消继续传播(当`cancelable`为`true`时有效) */
            this._end = false;
            /** 一个布尔值，表示 `preventDefault()` 方法是否取消了事件的默认行为。 */
            this.defaultPrevented = false; // TODO is false should be the default value?
            this.type = type;
            this.bubbles = !!(opts && opts.bubbles);
            this.cancelable = !!(opts && opts.cancelable);
        }
        /**
         * **阻止冒泡事件向上传播**
         * @description
         * 它不能阻止附加到相同元素的相同事件类型的其他事件处理器。如果要阻止这些处理器的运行，请参见 `stopImmediatePropagation()` 方法。
         * （当`cancelable`为`true`时有效）
         */
        stopPropagation() {
            this._stop = true;
        }
        /**
         * **立即阻止事件传播**
         * @description
         * 如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。
         * 如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。
         * 如果想只取消冒泡传播而继续执行相同元素剩下的事件监听器，请参见`stopPropagation()`方法。
         * （当`cancelable`为`true`时有效）
         */
        stopImmediatePropagation() {
            this._end = this._stop = true;
        }
        /** 阻止事件的默认行为 */
        preventDefault() {
            this.defaultPrevented = true;
        }
    };
    __setFunctionName(_classThis, "AsukaEvent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AsukaEvent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AsukaEvent = _classThis;
})();
export { AsukaEvent };
class AsukaFrame extends AsukaElement {
    constructor() {
        super(9, '#frame');
    }
}
export class AsukaWidget extends AsukaElement {
}
export class AsukaPage {
    constructor() {
        this.frameList = [];
        this._activeFrame = null;
    }
    get activeFrame() { return this._activeFrame; }
    set activeFrame(frame) {
        // TODO
        this._activeFrame = frame;
    }
    createFrame(mount = hmUI) {
        let frame = new AsukaFrame();
        return frame;
    }
    deleteFrame(frame) {
    }
}
//# sourceMappingURL=AsukaDOM.js.map