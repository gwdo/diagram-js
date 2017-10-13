'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class SpaceRules extends RuleProvider {

  constructor(eventBus) {
    super(eventBus);
  }

  init() {
    this.addRule('shape.resize', function(context) {
      return context.shape.children.length > 0;
    });
  }

}

SpaceRules.$inject = [ 'eventBus' ];

module.exports = SpaceRules;