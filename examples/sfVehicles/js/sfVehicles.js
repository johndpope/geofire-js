var map;

var locations = {
  "FirebaseHQ": [37.785326, -122.405696],
  "Caltrain": [37.7789, -122.3917]
};
var center = locations["FirebaseHQ"];
var radiusInKm = 0.75;

// Get a reference to the SF Muni public transit data
//var muniFirebaseRef = new Firebase("https://publicdata-transit.firebaseio.com/sf-muni/data");
var muniFirebaseRef = new Firebase("https://jacob-transit.firebaseio.com/sf-muni/vehicles");

// For the search
var geoFireFirebaseRef = new Firebase("https://geofire-demos.firebaseio.com/");
var geoFire = new GeoFire(geoFireFirebaseRef);

/*
// SOURCE VEHICLES
var sourceVehicleIds = [];
muniFirebaseRef.on("child_added", function(dataSnapshot) {
  var vehicleId = dataSnapshot.name();
  sourceVehicleIds.push(vehicleId);
});
muniFirebaseRef.on("child_removed", function(dataSnapshot) {
  var vehicleId = dataSnapshot.name();
  var index = sourceVehicleIds.indexOf(vehicleId);
  //console.assert(index !== -1, "Improperly removing source vehicle " + vehicleId);
  sourceVehicleIds.splice(index, 1);
});

// INDICES VEHICLES
var indicesVehicleIds = [];
var numIndicesDupes = 0;
geoFireFirebaseRef.child("i").on("child_added", function(dataSnapshot) {
  var vehicleId = dataSnapshot.name().slice(12);
  if (indicesVehicleIds.indexOf(vehicleId) !== -1) {
    numIndicesDupes++;
  }
  indicesVehicleIds.push(vehicleId);
});
geoFireFirebaseRef.child("i").on("child_removed", function(dataSnapshot) {
  var vehicleId = dataSnapshot.name().slice(12);
  var index = indicesVehicleIds.indexOf(vehicleId);
  //console.assert(index !== -1, "Improperly removing indices vehicle " + vehicleId);
  indicesVehicleIds.splice(index, 1);
});

// LOCATIONS VEHICLES
// var locationsVehicleIds = [];
// geoFireFirebaseRef.child("l").on("child_added", function(dataSnapshot) {
//   var vehicleId = dataSnapshot.name();
//   locationsVehicleIds.push(vehicleId);
// });
// geoFireFirebaseRef.child("l").on("child_removed", function(dataSnapshot) {
//   var vehicleId = dataSnapshot.name();
//   var index = locationsVehicleIds.indexOf(vehicleId);
//   //console.assert(index !== -1, "Improperly removing locations vehicle " + vehicleId);
//   locationsVehicleIds.splice(index, 1);
// });

window.setInterval(function() {
  console.log("Number of source vehicles: " + sourceVehicleIds.length);
  console.log("Number of indices: " + indicesVehicleIds.length);
  //console.log("Number of locations: " + locationsVehicleIds.length);

  //console.assert(numIndicesDupes === 0, "Duplicate indices found");

  //if (sourceVehicleIds.length === indicesVehicleIds.length && sourceVehicleIds.length === locationsVehicleIds.length) {
  //  sourceVehicleIds.forEach(function(vehicleId) {
      //console.assert(indicesVehicleIds.indexOf(vehicleId) !== -1, "Vehicle " + vehicleId + " not in indices locations");
      //console.assert(locationsVehicleIds.indexOf(vehicleId) !== -1, "Vehicle " + vehicleId + " not in locations locations");
  //  })
  //}
}, 10000);
*/

// Create a GeoQuery
var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});

// Keep track of all of the vehicles currently within the query
var vehiclesInQuery = {};

/* Adds new vehicle markers to the map when they enter the query */
geoQuery.on("key_entered", function(vehicleId, vehicleLocation) {
  console.log("Vehicle " + vehicleId + " entered the query.");

  // Verify state
  //console.assert(typeof vehiclesInQuery[vehicleId] === "undefined", "Vehicle " + vehicleId + " should not already be in the vehicles list.");

  // Specify that the vehicle has entered this query
  //vehicleId = vehicleId.split(":")[1];
  //vehiclesInQuery[vehicleId] = true;

  /*muniFirebaseRef.child(vehicleId).once("value", function(dataSnapshot) {
    // Get the vehicle data from the Open Data Set
    vehicle = dataSnapshot.val();

    // Verify the vehicle data is accurate
    //console.assert(vehicle !== null, "Vehicle " + vehicleId + " should exist in the Open Data Set.");
    //console.assert(parseInt(vehicle.id) === parseInt(vehicleId), "Vehicle " + vehicleId + " does not match the ID of vehicle " + vehicle.id + " stored in the Open Data Set.");

    // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
    // Set, add it to the map.
    if (vehiclesInQuery[vehicleId] === true) {
      //console.assert(parseFloat(vehicle.lat) === parseFloat(vehicleLocation[0]), "Vehicle " + vehicleId + " has inaccurate latitude.");
      //console.assert(parseFloat(vehicle.lon) === parseFloat(vehicleLocation[1]), "Vehicle " + vehicleId + " has inaccurate longitude.");

      // Add the vehicle to the list of vehicles in the query
      vehiclesInQuery[vehicleId] = vehicle;

      // Create a new marker for the vehicle
      vehicle.marker = createVehicleMarker(vehicle, getVehicleColor(vehicle));
    }
  });*/
});

// /* Moves vehicles markers on the map when their location within the query changes */
// geoQuery.on("key_moved", function(vehicleId, vehicleLocation) {
//   //console.log("Vehicle " + vehicleId + " moved within the query.");

//   // Get the vehicle from the list of vehicles in the query
//   vehicleId = vehicleId.split(":")[1];
//   var vehicle = vehiclesInQuery[vehicleId];

//   // Verify state
//   //console.assert(typeof vehicle !== "undefined", "Vehicle " + vehicleId + " should already be in the vehicles list.");
//   //console.assert(parseInt(vehicle.id) === parseInt(vehicleId), "Vehicle " + vehicleId + " does not match the ID of vehicle " + vehicle.id + " stored in the list of vehicles in the query.");
//   //console.assert(typeof vehicle.marker !== "undefined", "Vehicle " + vehicleId + " should already have a marker.");

//   // Animate the vehicle's marker
//   //vehicle.marker.animatedMoveTo(vehicleLocation);
// });

// /* Removes vehicle markers from the map when they exit the query */
// geoQuery.on("key_exited", function(vehicleId, vehicleLocation) {
//   //console.log("Vehicle " + vehicleId + " exited the query.");

//   // Get the vehicle from the list of vehicles in the query
//   vehicleId = vehicleId.split(":")[1];
//   var vehicle = vehiclesInQuery[vehicleId];

//   // Verify state
//   //console.assert(typeof vehicle !== "undefined", "Vehicle " + vehicleId + " should already be in the vehicles list.");

//   // If the vehicle's data has already been loaded from the Open Data Set, remove its marker from the map
//   // and remove it from the location console
//   /*if (vehicle !== true) {
//     // Verify state
//     //console.assert(parseInt(vehicle.id) === parseInt(vehicleId), "Vehicle " + vehicleId + " does not match the ID of vehicle " + vehicle.id + " stored in the list of vehicles in the query.");
//     //console.assert(typeof vehicle.marker !== "undefined", "Vehicle " + vehicleId + " should already have a marker.");

//     // Remove the vehicle's marker from the map
//     vehicle.marker.setMap(null);
//     // vehicle.marker = null;
//   }*/

//   // Remove the vehicle from the list of vehicles in the query
//   delete vehiclesInQuery[vehicleId];
// });

/* Initializes the Google Map */
function initializeMap() {
  // Get the location as a Google Maps latitude-longitude object
  var loc = new google.maps.LatLng(center[0], center[1]);

  // Create the Google Map
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: loc,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create a draggable circle centered on the map
  var circle = new google.maps.Circle({
    strokeColor: "#6D3099",
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: "#B650FF",
    fillOpacity: 0.35,
    map: map,
    center: loc,
    radius: ((radiusInKm) * 1000),
    draggable: true
  });

  // Update the query's criteria every time the circle is dragged
  var updateCriteria = _.debounce(function() {
    var latLng = circle.getCenter();
    geoQuery.updateCriteria({
      center: [latLng.lat(), latLng.lng()],
      radius: radiusInKm
    });
  }, 10);
  google.maps.event.addListener(circle, "drag", updateCriteria);
}

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Adds a marker for the inputted vehicle to the map */
function createVehicleMarker(vehicle, vehicleColor) {
  var marker = new google.maps.Marker({
    icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
    position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
    optimized: true,
    map: map
  });

  return marker;
}

/* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
function getVehicleColor(vehicle) {
  return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
}

/* Returns true if the two inputted coordinates are approximately equivalent */
function coordinatesAreEquivalent(coord1, coord2) {
  return (Math.abs(coord1 - coord2) < 0.000001);
}

/* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
  var toLat = newLocation[0];
  var toLng = newLocation[1];

  var fromLat = this.getPosition().lat();
  var fromLng = this.getPosition().lng();

  if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
    var percent = 0;
    var latDistance = toLat - fromLat;
    var lngDistance = toLng - fromLng;
    var interval = window.setInterval(function () {
      percent += 0.01;
      var curLat = fromLat + (percent * latDistance);
      var curLng = fromLng + (percent * lngDistance);
      var pos = new google.maps.LatLng(curLat, curLng);
      this.setPosition(pos);
      if (percent >= 1) {
        window.clearInterval(interval);
      }
    }.bind(this), 50);
  }
};
