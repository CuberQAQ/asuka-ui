import { type AsukaNode, NodeFactory } from '../../../core/base.js';
import { LiteWidgetArc, LiteWidgetArcAttributes } from './arc.js';
import { LiteWidgetButton, LiteWidgetButtonAttributes } from './button.js';
import { LiteWidgetCanvas, LiteWidgetCanvasAttributes } from './canvas.js';
import {
  LiteWidgetFillRect,
  LiteWidgetFillRectAttributes,
} from './fill-rect.js';
import { LiteWidgetImage, LiteWidgetImageAttributes } from './image.js';
import {
  LiteWidgetPolyline,
  LiteWidgetPolylineAttributes,
} from './polyline.js';
import { LiteWidgetQRCode, LiteWidgetQRCodeAttributes } from './qrcode.js';
import {
  LiteWidgetStrokeRect,
  LiteWidgetStrokeRectAttributes,
} from './stroke-rect.js';
import { LiteWidgetText, LiteWidgetTextAttributes } from './text.js';
import { LiteBlock, LiteBlockAttributes } from './lite-widget.js';

const nodeMap: Record<
  string,
  { new (nodeType: number | null, nodeName: string): AsukaNode }
> = {
  'l-block': LiteBlock,
  'l-text': LiteWidgetText,
  'l-fill-rect': LiteWidgetFillRect,
  'l-stroke-rect': LiteWidgetStrokeRect,
  'l-img': LiteWidgetImage,
  'l-button': LiteWidgetButton,
  'l-arc': LiteWidgetArc,
  'l-qrcode': LiteWidgetQRCode,
  'l-polyline': LiteWidgetPolyline,
  'l-canvas': LiteWidgetCanvas,
};

export const LiteBindingsFactory: NodeFactory = {
  createNode(type) {
    return nodeMap[type] ? new nodeMap[type](null, type) : null;
  },
};

export declare interface LiteWidgetAttributesTypeMap {
  'l-block': LiteBlockAttributes;
  'l-fill-rect': LiteWidgetFillRectAttributes;
  'l-stroke-rect': LiteWidgetStrokeRectAttributes;
  'l-text': LiteWidgetTextAttributes;
  'l-img': LiteWidgetImageAttributes;
  'l-button': LiteWidgetButtonAttributes;
  'l-arc': LiteWidgetArcAttributes;
  'l-qrcode': LiteWidgetQRCodeAttributes;
  'l-polyline': LiteWidgetPolylineAttributes;
  'l-canvas': LiteWidgetCanvasAttributes;
}
