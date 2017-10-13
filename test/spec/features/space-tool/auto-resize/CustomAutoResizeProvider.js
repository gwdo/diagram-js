'use strict';

import AutoResizeProvider from '../../../../../lib/features/auto-resize/AutoResizeProvider';


export default class CustomAutoResizeProvider extends AutoResizeProvider {

  canResize(elements, target) {
    return target.parent;
  }
}
