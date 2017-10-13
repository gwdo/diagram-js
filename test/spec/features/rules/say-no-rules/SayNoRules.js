'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class SayNoRules extends RuleProvider {

  init() {

    this.addRule('shape.resize', function(context) {
      return false;
    });
  }
}

SayNoRules.$inject = [ 'eventBus' ];

module.exports = SayNoRules;