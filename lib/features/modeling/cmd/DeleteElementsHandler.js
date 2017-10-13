'use strict';

import forEach from 'lodash/collection/forEach';

export default class DeleteElementsHandler {

  constructor(modeling, elementRegistry) {
    this._modeling = modeling;
    this._elementRegistry = elementRegistry;
  }

  postExecute(context) {

    var modeling = this._modeling,
        elementRegistry = this._elementRegistry,
        elements = context.elements;

    forEach(elements, function(element) {

      // element may have been removed with previous
      // remove operations already (e.g. in case of nesting)
      if (!elementRegistry.get(element.id)) {
        return;
      }

      if (element.waypoints) {
        modeling.removeConnection(element);
      } else {
        modeling.removeShape(element);
      }
    });
  }
}

DeleteElementsHandler.$inject = [ 'modeling', 'elementRegistry' ];
