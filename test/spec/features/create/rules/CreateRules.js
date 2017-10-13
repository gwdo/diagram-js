'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class CreateRules extends RuleProvider {

  init() {
    this.addRule('shape.create', function(context) {

      var target = context.target;

      if (/child/.test(target.id)) {
        return 'attach';
      }

      if (/parent/.test(target.id) || context.source) {
        return true;
      }

      return false;
    });
  }
}

CreateRules.$inject = [ 'eventBus' ];

module.exports = CreateRules;
