'use strict';

import forEach from 'lodash/forEach';

var HANDLE_OFFSET = -2,
    HANDLE_SIZE  = 5,
    HANDLE_HIT_SIZE = 20;

var CLS_RESIZER   = 'djs-resizer';

import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgClasses from 'tiny-svg/lib/classes';
import svgClear from 'tiny-svg/lib/clear';
import svgCreate from 'tiny-svg/lib/create';

import domEvent from 'min-dom/lib/event';

import { isPrimaryButton } from '../../util/Mouse';

import { asTRBL } from '../../layout/LayoutUtil';

import { transform } from '../../util/SvgTransformUtil';


/**
 * This component is responsible for adding resize handles.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 * @param {Selection} selection
 * @param {Resize} resize
 */
export default class ResizeHandles {

  constructor(eventBus, canvas, selection, resize) {

    this._resize = resize;
    this._canvas = canvas;

    var self = this;

    eventBus.on('selection.changed', function(e) {
      var newSelection = e.newSelection;

      // remove old selection markers
      self.removeResizers();

      // add new selection markers ONLY if single selection
      if (newSelection.length === 1) {
        forEach(newSelection, self.addResizer.bind(self));
      }
    });

    eventBus.on('shape.changed', function(e) {
      var shape = e.element;

      if (selection.isSelected(shape)) {
        self.removeResizers();

        self.addResizer(shape);
      }
    });
  }

  makeDraggable(element, gfx, direction) {
    var resize = this._resize;

    function startResize(event) {
      // only trigger on left mouse button
      if (isPrimaryButton(event)) {
        resize.activate(event, element, direction);
      }
    }

    domEvent.bind(gfx, 'mousedown', startResize);
    domEvent.bind(gfx, 'touchstart', startResize);
  }

  _createResizer(element, x, y, rotation, direction) {
    var resizersParent = this._getResizersParent();

    var group = svgCreate('g');
    svgClasses(group).add(CLS_RESIZER);
    svgClasses(group).add(CLS_RESIZER + '-' + element.id);
    svgClasses(group).add(CLS_RESIZER + '-' + direction);

    svgAppend(resizersParent, group);

    var origin = -HANDLE_SIZE + HANDLE_OFFSET;

    // Create four drag indicators on the outline
    var visual = svgCreate('rect');
    svgAttr(visual, {
      x: origin,
      y: origin,
      width: HANDLE_SIZE,
      height: HANDLE_SIZE
    });
    svgClasses(visual).add(CLS_RESIZER + '-visual');

    svgAppend(group, visual);

    var hit = svgCreate('rect');
    svgAttr(hit, {
      x: origin,
      y: origin,
      width: HANDLE_HIT_SIZE,
      height: HANDLE_HIT_SIZE
    });
    svgClasses(hit).add(CLS_RESIZER + '-hit');

    svgAppend(group, hit);

    transform(group, x, y, rotation);

    return group;
  }

  createResizer(element, direction) {
    var resizer;

    var trbl = asTRBL(element);

    if (direction === 'nw') {
      resizer = this._createResizer(element, trbl.left, trbl.top, 0, direction);
    } else if (direction === 'ne') {
      resizer = this._createResizer(element, trbl.right, trbl.top, 90, direction);
    } else if (direction === 'se') {
      resizer = this._createResizer(element, trbl.right, trbl.bottom, 180, direction);
    } else {
      resizer = this._createResizer(element, trbl.left, trbl.bottom, 270, direction);
    }

    this.makeDraggable(element, resizer, direction);
  }

  // resize handles implementation ///////////////////////////////

  /**
   * Add resizers for a given element.
   *
   * @param {djs.model.Shape} shape
   */
  addResizer(shape) {
    var resize = this._resize;

    if (!resize.canResize({ shape: shape })) {
      return;
    }

    this.createResizer(shape, 'nw');
    this.createResizer(shape, 'ne');
    this.createResizer(shape, 'se');
    this.createResizer(shape, 'sw');
  }

  /**
   * Remove all resizers
   */
  removeResizers() {
    var resizersParent = this._getResizersParent();

    svgClear(resizersParent);
  }

  _getResizersParent() {
    return this._canvas.getLayer('resizers');
  }
}

ResizeHandles.$inject = [
  'eventBus',
  'canvas',
  'selection',
  'resize'
];
