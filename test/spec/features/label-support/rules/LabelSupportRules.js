'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class MoveRules extends RuleProvider {

  init() {

    this.addRule('elements.move', function(context) {
      var target = context.target,
          shapes = context.shapes;

      // check that we do not accidently try to drop elements
      // onto themselves or children of themselves
      while (target) {
        if (shapes.indexOf(target) !== -1) {
          return false;
        }

        target = target.parent;
      }
    });

  }
}

MoveRules.$inject = [ 'eventBus' ];

module.exports = MoveRules;
