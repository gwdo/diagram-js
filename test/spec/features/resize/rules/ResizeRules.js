'use strict';

import RuleProvider from '../../../../../lib/features/rules/RuleProvider';


export default class ResizeRules extends RuleProvider {

  init() {

    this.addRule('shape.resize', function(context) {

      var shape = context.shape;

      if (!context.newBounds) {
        // check general resizability
        if (!shape.resizable) {
          return false;
        }
      } else {
        if (shape.resizable === 'always') {
          return true;
        }
        // element must have minimum size of 50*50 points
        return context.newBounds.width > 50 && context.newBounds.height > 50;
      }
    });
  }
}

ResizeRules.$inject = [ 'eventBus' ];
