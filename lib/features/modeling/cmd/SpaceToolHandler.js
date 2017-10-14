'use strict';

import forEach from 'lodash/forEach';

import { resizeBounds } from '../../space-tool/SpaceUtil';

/**
 * A handler that implements reversible creating and removing of space.
 *
 * It executes in two phases:
 *
 *  (1) resize all affected resizeShapes
 *  (2) move all affected moveElements
 */
export default class SpaceToolHandler {

  constructor(modeling) {
    this._modeling = modeling;
  }

  preExecute(context) {

    // resize
    var modeling = this._modeling,
        resizingShapes = context.resizingShapes,
        delta = context.delta,
        direction = context.direction;

    forEach(resizingShapes, function(shape) {
      var newBounds = resizeBounds(shape, direction, delta);

      modeling.resizeShape(shape, newBounds);
    });
  }

  postExecute(context) {
    // move
    var modeling = this._modeling,
        movingShapes = context.movingShapes,
        delta = context.delta;

    modeling.moveElements(movingShapes, delta, undefined, false, { autoResize: false });
  }

}

SpaceToolHandler.$inject = [ 'modeling' ];
