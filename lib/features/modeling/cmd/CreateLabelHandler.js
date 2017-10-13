'use strict';

var CreateShapeHandler = require('./CreateShapeHandler');


/**
 * A handler that attaches a label to a given target shape.
 *
 * @param {canvas} Canvas
 */
class CreateLabelHandler extends CreateShapeHandler {

  constructor(canvas) {
    super(canvas);
  }

  /**
   * Appends a label to a target shape.
   *
   * @method CreateLabelHandler#execute
   *
   * @param {Object} context
   * @param {ElementDescriptor} context.target the element the label is attached to
   * @param {ElementDescriptor} context.parent the parent object
   * @param {Point} context.position position of the new element
   */
  execute(context) {

    var label = context.shape;

    ensureValidDimensions(label);

    label.labelTarget = context.labelTarget;

    return super.execute(context);
  }

  /**
   * Undo append by removing the shape
   */
  revert(context) {
    context.shape.labelTarget = null;

    return super.revert(context);
  }
}

CreateLabelHandler.$inject = [ 'canvas' ];

module.exports = CreateLabelHandler;


////// helpers /////////////////////////////////////////

function ensureValidDimensions(label) {
  // make sure a label has valid { width, height } dimensions
  [ 'width', 'height' ].forEach(function(prop) {
    if (typeof label[prop] === 'undefined') {
      label[prop] = 0;
    }
  });
}