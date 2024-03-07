import hmUI from '@zos/ui';
import { log, px as _px } from '@zos/utils';
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
  try {
    if (typeof success === 'function') success = success();
    if (!success) {
      throw Error('Assert Failed');
    }
  } catch (e) {
    reportError('Assert Failed', e);
  }
}

export function reportError(extra: string, err: Error | string | unknown) {
  console.log("Reporting Error...");
  
    // logger.error(`ERROR:message=${extra} err=${err}`);
    let bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: px(480),
      h: px(480),
      color: 0xd05977,
    });
    let title = hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(0),
      y: px(20),
      w: px(480),
      h: px(80),
      text: 'ERROR!',
      text_size: px(60),
      font: 'fonts/UbuntuMono-Bold.ttf',
      color: 0xfcfcfc,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
    });
    let y = px(100);

    y += showSubtitle(extra, y) + px(10);
    y += showSubtitle('Error Name', y) + px(5);
    y += showCode((err as Error).name ?? 'No Name Founded', y) + px(10);
    y += showSubtitle('Error Message', y) + px(5);
    y += showCode((err as Error).message ?? 'No Message Founded', y) + px(10);
    y += showSubtitle('Error Stack', y) + px(5);
    y += showCode((err as Error).stack ?? 'No Stack Founded', y) + px(10);
    bg.setProperty(hmUI.prop.MORE, {
      x: 0,
      y: 0,
      w: px(480),
      h: y + px(200),
    } as any);
    throw err;
  
}

const px = (p: number) => Number(_px(p));

const SubTitleTextSize = px(36);
const SubTitleTextWidth = px(400);
function showSubtitle(text: string, offsetY: number): number {
  let { width, height } = hmUI.getTextLayout(text, {
    text_size: px(42),
    text_width: SubTitleTextWidth,
    // font: "fonts/UbuntuMono-Regular.ttf",
    wrapped: 1,
  } as any);
  let text1 = hmUI.createWidget(hmUI.widget.TEXT, {
    x: px(40),
    y: offsetY,
    w: px(400),
    h: height,
    text,
    text_size: SubTitleTextSize,
    text_style: hmUI.text_style.WRAP,
    font: 'fonts/UbuntuMono-Bold.ttf',
    color: 0xfcfcfc,
    // align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.BOTTOM,
  });
  return height;
}

const CodeTextSize = px(30);
const CodeTextWidth = px(370);
function showCode(text: string, offsetY: number): number {
  let { width, height } = hmUI.getTextLayout(text, {
    text_size: px(30),
    text_width: CodeTextWidth,
    // font: "fonts/UbuntuMono-Regular.ttf",
    wrapped: 1,
  } as any);
  if (height < px(45)) height = px(45);
  let bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: px(40),
    y: offsetY,
    w: px(400),
    radius: px(8),
    h: height,
    color: 0x6f2641,
  });
  let text1 = hmUI.createWidget(hmUI.widget.TEXT, {
    x: px(55),
    y: offsetY,
    w: CodeTextWidth,
    h: height,
    text,
    text_size: CodeTextSize,
    text_style: hmUI.text_style.WRAP,
    font: 'fonts/UbuntuMono-Regular.ttf',
    color: 0xeeeeee,
    // align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
  });
  return height;
}
