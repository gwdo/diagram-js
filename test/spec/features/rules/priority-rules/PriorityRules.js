'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');


var HIGH_PRIORITY = 1500;


class PriorityRules extends RuleProvider {

  init() {

    // a white+black list containing
    // element ids
    var whiteList = [
      'always-resizable'
    ];

    var blackList = [
      'never-resizable'
    ];


    this.addRule('shape.resize', function(context) {
      return context.shape.resizable;
    });


    this.addRule('shape.resize', HIGH_PRIORITY, function(context) {
      var shape = context.shape;

      if (whiteList.indexOf(shape.id) !== -1) {
        return true;
      }

      if (blackList.indexOf(shape.id) !== -1) {
        return false;
      }
    });

  }
}

PriorityRules.$inject = [ 'eventBus' ];

module.exports = PriorityRules;