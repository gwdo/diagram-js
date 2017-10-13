import MoveModule from '../move';

import LabelSupport from './LabelSupport';

export default {
  __depends__: [
    MoveModule
  ],
  __init__: [ 'labelSupport' ],
  labelSupport: [ 'type', LabelSupport ]
};
