import SelectionModule from '../selection';

import Dragging from './Dragging';
import HoverFix from './HoverFix';

export default {
  __depends__: [
    SelectionModule
  ],
  __init__: [
    'hoverFix'
  ],
  dragging: [ 'type', Dragging ],
  hoverFix: [ 'type', HoverFix ]
};