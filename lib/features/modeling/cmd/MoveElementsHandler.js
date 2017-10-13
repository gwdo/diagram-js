'use strict';

import MoveHelper from './helper/MoveHelper';


/**
 * A handler that implements reversible moving of shapes.
 */
export default class MoveElementsHandler {

  constructor(modeling) {
    this._helper = new MoveHelper(modeling);
  }

  preExecute(context) {
    context.closure = this._helper.getClosure(context.shapes);
  }

  postExecute(context) {

    var hints = context.hints,
        primaryShape;

    if (hints && hints.primaryShape) {
      primaryShape = hints.primaryShape;
      hints.oldParent = primaryShape.parent;
    }

    this._helper.moveClosure(context.closure, context.delta, context.newParent, context.newHost, primaryShape);
  }

  execute(context) { }
  revert(context) { }
}

MoveElementsHandler.$inject = [ 'modeling' ];
