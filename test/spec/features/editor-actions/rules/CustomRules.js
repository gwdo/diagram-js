'use strict';

var RuleProvider = require('../../../../../lib/features/rules/RuleProvider');

class CustomRules extends RuleProvider { }

CustomRules.$inject = ['eventBus'];

module.exports = CustomRules;
