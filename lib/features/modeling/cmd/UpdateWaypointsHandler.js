'use strict';

export default class UpdateWaypointsHandler {

  execute(context) {

    var connection = context.connection,
        newWaypoints = context.newWaypoints;

    context.oldWaypoints = connection.waypoints;

    connection.waypoints = newWaypoints;

    return connection;
  }

  revert(context) {

    var connection = context.connection,
        oldWaypoints = context.oldWaypoints;

    connection.waypoints = oldWaypoints;

    return connection;
  }
}
