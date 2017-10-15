'use strict';

import forEach from 'lodash-es/forEach';
import filter from 'lodash-es/filter';

var LOW_PRIORITY = 250,
    HIGH_PRIORITY = 1400;

import CommandInterceptor from '../../command/CommandInterceptor';


/**
 * A handler that makes sure labels are properly moved with
 * their label targets.
 */
export default class LabelSupport extends CommandInterceptor {

  constructor(eventBus, modeling, movePreview) {
    super(eventBus);

    // remove labels from the collection that are being
    // moved with other elements anyway
    eventBus.on('shape.move.start', HIGH_PRIORITY, function(e) {

      var context = e.context,
          shapes = context.shapes,
          validatedShapes = context.validatedShapes;

      context.shapes = removeLabels(shapes);
      context.validatedShapes = removeLabels(validatedShapes);
    });


    // add labels to visual's group
    eventBus.on('shape.move.start', LOW_PRIORITY, function(e) {

      var context = e.context,
          shapes = context.shapes;

      var labels = [];

      forEach(shapes, function(element) {
        var label = element.label;

        if (label && !label.hidden && context.shapes.indexOf(label) === -1) {
          labels.push(label);
        }

        if (element.labelTarget) {
          labels.push(element);
        }
      });

      forEach(labels, function(label) {
        movePreview.makeDraggable(context, label, true);
      });

    });

    // move labels after the other shapes are done moving
    this.postExecuted([ 'elements.move' ], function(e) {
      var context = e.context,
          closure = context.closure,
          enclosedElements = closure.enclosedElements;

      // ensure we move all labels with their respective elements
      // if they have not been moved already
      forEach(enclosedElements, function(element) {
        if (element.label && !enclosedElements[element.label.id]) {
          modeling.moveShape(element.label, context.delta, element.parent);
        }
      });

    });

  }
}

LabelSupport.$inject = [
  'eventBus',
  'modeling',
  'movePreview'
];


/**
 * Return a filtered list of elements that do not
 * contain attached elements with hosts being part
 * of the selection.
 *
 * @param  {Array<djs.model.Base>} elements
 *
 * @return {Array<djs.model.Base>} filtered
 */
function removeLabels(elements) {

  return filter(elements, function(element) {

    // filter out labels that are move together
    // with their label targets
    return elements.indexOf(element.labelTarget) === -1;
  });
}
