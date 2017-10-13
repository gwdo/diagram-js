'use strict';

var AutoResizeProvider = require('../../../../../lib/features/auto-resize/AutoResizeProvider');


class CustomAutoResizeProvider extends AutoResizeProvider {

  constructor(eventBus) {
    super(eventBus);
  }

  canResize(elements, target) {
    return target.parent;
  }
}

module.exports = CustomAutoResizeProvider;