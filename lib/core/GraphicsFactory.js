'use strict';

import forEach from 'lodash-es/forEach';
import reduce from 'lodash-es/reduce';

import {
  getChildren,
  getVisual
} from '../util/GraphicsUtil';

import { translate } from '../util/SvgTransformUtil';

import domClear from 'min-dom/lib/clear';

import svgAppend from 'tiny-svg/lib/append';
import svgAttr from 'tiny-svg/lib/attr';
import svgClasses from 'tiny-svg/lib/classes';
import svgCreate from 'tiny-svg/lib/create';
import svgRemove from 'tiny-svg/lib/remove';


/**
 * A factory that creates graphical elements
 *
 * @param {EventBus} eventBus
 * @param {ElementRegistry} elementRegistry
 */
export default class GraphicsFactory {

  constructor(eventBus, elementRegistry) {
    this._eventBus = eventBus;
    this._elementRegistry = elementRegistry;
  }

  _getChildren(element) {

    var gfx = this._elementRegistry.getGraphics(element);

    var childrenGfx;

    // root element
    if (!element.parent) {
      childrenGfx = gfx;
    } else {
      childrenGfx = getChildren(gfx);
      if (!childrenGfx) {
        childrenGfx = svgCreate('g');
        svgClasses(childrenGfx).add('djs-children');

        svgAppend(gfx.parentNode, childrenGfx);
      }
    }

    return childrenGfx;
  }

  /**
   * Clears the graphical representation of the element and returns the
   * cleared visual (the <g class="djs-visual" /> element).
   */
  _clear(gfx) {
    var visual = getVisual(gfx);

    domClear(visual);

    return visual;
  }

  /**
   * Creates a gfx container for shapes and connections
   *
   * The layout is as follows:
   *
   * <g class="djs-group">
   *
   *   <!-- the gfx -->
   *   <g class="djs-element djs-(shape|connection)">
   *     <g class="djs-visual">
   *       <!-- the renderer draws in here -->
   *     </g>
   *
   *     <!-- extensions (overlays, click box, ...) goes here
   *   </g>
   *
   *   <!-- the gfx child nodes -->
   *   <g class="djs-children"></g>
   * </g>
   *
   * @param {Object} parent
   * @param {String} type the type of the element, i.e. shape | connection
   */
  _createContainer(type, parentGfx) {
    var outerGfx = svgCreate('g');
    svgClasses(outerGfx).add('djs-group');

    svgAppend(parentGfx, outerGfx);

    var gfx = svgCreate('g');
    svgClasses(gfx).add('djs-element');
    svgClasses(gfx).add('djs-' + type);

    svgAppend(outerGfx, gfx);

    // create visual
    var visual = svgCreate('g');
    svgClasses(visual).add('djs-visual');

    svgAppend(gfx, visual);

    return gfx;
  }

  create(type, element) {
    var childrenGfx = this._getChildren(element.parent);
    return this._createContainer(type, childrenGfx);
  }

  updateContainments(elements) {

    var self = this,
        elementRegistry = this._elementRegistry,
        parents;

    parents = reduce(elements, function(map, e) {

      if (e.parent) {
        map[e.parent.id] = e.parent;
      }

      return map;
    }, {});

    // update all parents of changed and reorganized their children
    // in the correct order (as indicated in our model)
    forEach(parents, function(parent) {

      var childGfx = self._getChildren(parent),
          children = parent.children;

      if (!children) {
        return;
      }

      forEach(children.slice().reverse(), function(c) {
        var gfx = elementRegistry.getGraphics(c);

        prependTo(gfx.parentNode, childGfx);
      });
    });
  }

  drawShape(visual, element) {
    var eventBus = this._eventBus;

    return eventBus.fire('render.shape', { gfx: visual, element: element });
  }

  getShapePath(element) {
    var eventBus = this._eventBus;

    return eventBus.fire('render.getShapePath', element);
  }

  drawConnection(visual, element) {
    var eventBus = this._eventBus;

    return eventBus.fire('render.connection', { gfx: visual, element: element });
  }

  getConnectionPath(waypoints) {
    var eventBus = this._eventBus;

    return eventBus.fire('render.getConnectionPath', waypoints);
  }

  update(type, element, gfx) {
    // Do not update root element
    if (!element.parent) {
      return;
    }

    var visual = this._clear(gfx);

    // redraw
    if (type === 'shape') {
      this.drawShape(visual, element);

      // update positioning
      translate(gfx, element.x, element.y);
    } else
    if (type === 'connection') {
      this.drawConnection(visual, element);
    } else {
      throw new Error('unknown type: ' + type);
    }

    if (element.hidden) {
      svgAttr(gfx, 'display', 'none');
    } else {
      svgAttr(gfx, 'display', 'block');
    }
  }

  remove(element) {
    var gfx = this._elementRegistry.getGraphics(element);

    // remove
    svgRemove(gfx.parentNode);
  }
}

GraphicsFactory.$inject = [
  'eventBus',
  'elementRegistry'
];


////////// helpers ///////////

function prependTo(newNode, parentNode) {
  parentNode.insertBefore(newNode, parentNode.firstChild);
}
