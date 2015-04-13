var width = 1000,
    height = 600;         

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var no = document.getElementById('horizon_no');
var yes = document.getElementById('horizon_yes');

no.onclick = function() {
  document.getElementById("myclipangle_container").style.visibility = "visible";
}
yes.onclick = function() {
  document.getElementById("myclipangle_container").style.visibility = "hidden";
}


// When clicked (or on first load), set the parameters from the boxes, then build the map
function clickFunction() {

document.getElementById("myclipangle_container").style.visibility = "hidden";

  var distance = document.getElementById("mydistance").value;
  var scale = document.getElementById("myscale").value;
  var yaw = document.getElementById("myyaw").value;
  var pitch = document.getElementById("mypitch").value;
  var roll = document.getElementById("myroll").value;
  var centerx = document.getElementById("mycenterx").value;
  var centery = document.getElementById("mycentery").value;
  var tilt = document.getElementById("mytilt").value;
  var precision = document.getElementById("myprecision").value;
  var graticulex = document.getElementById("mygraticulex").value;
  var graticuley = document.getElementById("mygraticuley").value;

  if(document.getElementById('horizon_yes').checked) {
    var clipAngle = Math.acos(1 / distance) * 180 / Math.PI - 1e-6;
  }else if(document.getElementById('horizon_no').checked) {
    var clipAngle = document.getElementById("myclipangle").value;
  }

  // var projection = d3.geo.satellite()
    var projection = d3.geo.satellite()
      .distance(distance)
      .scale(scale)    
      .center([centerx, centery])
      .tilt(tilt)
      .clipAngle(clipAngle)
      .precision(precision)
      // .clipExtent([[0, 0], [width, height]])
      .rotate([yaw, pitch, roll]) //yaw, pitch, roll    ;    

  var graticule = d3.geo.graticule()
    // .extent([-36,-110.50],[-47,57])
    .step([graticulex, graticuley]);

  buildMap(projection, graticule);
}  

function buildMap(projection, graticule) {
d3.json("js/world_topo.json", function(error, world) {
  if (error) return console.error(error);

  d3.select("body").selectAll(".place-label").data([]).exit().remove();
  d3.select("body").selectAll("path").data([]).exit().remove();  
  d3.select("body").selectAll("use").data([]).exit().remove();  
  d3.select("body").selectAll("defs").data([]).exit().remove();  


var path = d3.geo.path()
  .projection(projection)
  .pointRadius([5]);

// Define the sphere of the world, and the ocean color
svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

// graticules
  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// define countries
  svg.selectAll(".subunit")
    .data(topojson.feature(world, world.objects.a50m_world).features)
    .enter().append("path")
    .attr("class", function(d) {
      return "subunit " + d.id; 
    })
    .attr('d', path);

// define borders
  svg.append("path")
    .datum(topojson.mesh(world, world.objects.a50m_world, function(a, b) { return a !== b && a.id !== "IRL";}))
    .attr("d", path)
    .attr("class", "subunit-boundary");

// define places and labels
  svg.append("path")
      .datum(topojson.feature(world, world.objects.china_cities_places3))
      .attr("d", path)
      .attr("class", "place");

    path.pointRadius([25]);

  svg.selectAll(".place-label")
      .data(topojson.feature(world, world.objects.china_cities_places3).features)
    .enter().append("text")
    .attr("class", "place-label")
    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
    .attr("dy", ".65em")
    .attr("dx", ".65em")
    .text(function(d) { return d.properties.name; });

    });
};


// Presets

function clickPreset(x) {
  if (x === "globe") {
    var distance = 1.1;
    var scale = 1500;
    var yaw = 0;
    var pitch = -36.5;
    var roll = 0;
    var centerx = -2;
    var centery = 5;
    var tilt = 0;
    var precision = 0.1 ;
    var graticulex = 3;
    var graticuley = 3;
  }
  else if (x === "fisheye") {
    var distance = 1.1;
    var scale = 1000;
    var yaw = -10;
    var pitch = -130;
    var roll = 32;
    var centerx = -10;
    var centery = 55;
    var tilt = 10;
    var precision = 0.1 ;
    var graticulex = 3;
    var graticuley = 3;
  } else if (x === "us") {
    var distance = 1.1;
    var scale = 5500;
    var yaw = 76.00;
    var pitch = -34.5;
    var roll = 32.12;
    var centerx = -2;
    var centery = 5;
    var tilt = 24;
    var precision = 0.1 ;
    var graticulex = 3;
    var graticuley = 3;
  } else if (x === "west") {
    var distance = 20;
    var scale = 1500;
    var yaw = 115.00;
    var pitch = 15;
    var roll = 15;
    var centerx = -10;
    var centery = 55;
    var tilt = 20;
    var precision = 0.1 ;
    var graticulex = 1;
    var graticuley = 1; 
  } else if (x === "original") {
    var distance = 20;
    var scale = 1500;
    var yaw = -115.00;
    var pitch = 15;
    var roll = 15;
    var centerx = -10;
    var centery = 55;
    var tilt = 20;
    var precision = 0.1 ;
    var graticulex = 1;
    var graticuley = 1; 
  } else if (x === "random") {    
    var distance = getRandomInt(1.1,24);
    var scale = getRandomInt(100,6000);
    var yaw = getRandomInt(-180,180);
    var pitch = getRandomInt(-180,180);
    var roll = getRandomInt(-180,180);
    var centerx = -10;
    var centery = 55;
    var tilt = getRandomInt(0,24);
    var precision = 0.1;
    var graticulex = getRandomInt(1,10);
    var graticuley = getRandomInt(1,10);
  };

  document.getElementById("mydistance").value = distance ;
  document.getElementById("myscale").value = scale ;
  document.getElementById("myyaw").value = yaw ;
  document.getElementById("mypitch").value = pitch ;
  document.getElementById("myroll").value = roll ;
  document.getElementById("mycenterx").value = centerx ;
  document.getElementById("mycentery").value = centery ;
  document.getElementById("mytilt").value = tilt ;
  document.getElementById("myprecision").value = precision ;
  document.getElementById("mygraticulex").value = graticulex ;
  document.getElementById("mygraticuley").value = graticuley ;

  clickFunction();

}

d3.select(self.frameElement).style("height", height + "px");

window.onload= clickFunction();

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }