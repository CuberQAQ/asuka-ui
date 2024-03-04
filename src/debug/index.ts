import { log } from '@zos/utils';
const hmLogger = log.getLogger('AsukaUI');
const logger = {
  log: hmLogger.log,
  warn: hmLogger.warn,
  error: hmLogger.error,
  info: hmLogger.info,
  debug: hmLogger.debug,
};

/**
 * **断言**
 * @description
 * 用于检查某个表达式或函数的执行结果。如果为false，将抛出一个断言错误。
 * @param success 
 */
export function assert(success: boolean | (() => boolean)) {
  if (typeof success === 'function') success = success();
  if (!success) {
    throw Error('Assert Failed');
  }
}

export function reportError(extra: string, err: Error) {
  logger.error(`ERROR:message=${extra} err=${err}`)
}
