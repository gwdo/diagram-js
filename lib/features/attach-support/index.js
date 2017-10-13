import MoveModule from '../move';
import LabelSupportModule from '../label-support';

import AttachSupport from './AttachSupport';

export default {
  __depends__: [
    MoveModule,
    LabelSupportModule
  ],
  __init__: [ 'attachSupport'],
  attachSupport: [ 'type', AttachSupport ]
};
