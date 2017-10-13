'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class ResizeRules extends RuleProvider {

  constructor(eventBus) {
    super(eventBus);
  }

  init() {

    this.addRule('shape.resize', function(context) {

      var shape = context.shape;

      if (shape.ignoreResize) {
        return null;
      }

      return shape.resizable !== undefined ? shape.resizable : undefined;
    });
  }
}

ResizeRules.$inject = [ 'eventBus' ];

module.exports = ResizeRules;