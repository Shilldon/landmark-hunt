import { Map, View } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Circle, Polygon/*, Point, LineString*/ } from 'ol/geom'
import { Style, Stroke, Fill/*, Circle as CircleStyle, RegularShape*/ } from 'ol/style'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj.js';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import { defaults, DoubleClickZoom, MouseWheelZoom } from 'ol/interaction'
import * as database from './database-query'
//import { getVectorContext } from 'ol/render.js';

let map = new Map({
  target: "map",
  interactions: defaults({
    mouseWheelZoom: false,
    doubleClickZoom: false
  }),
  layers: [
    new TileLayer({
      source: new OSM(),
      visible: true
    })
  ],
  view: new View({
    center: fromLonLat([-4.4, 54.6]),
    zoom: 6,
  })
});
/*
var locations = [[-4.4, 54.6], [-9.4, 54.9]];

var route = new LineString(locations);
route.transform('EPSG:4326', 'EPSG:3857');
const geoMarker = new Feature({
  type: 'geoMarker',
  geometry: new Point(fromLonLat([-4.4, 54.6])),
});
const stroke = new Stroke({ color: 'green', width: 2 });
const fill = new Fill({ color: 'transparent' });
const styles = {
  'geoMarker': [new Style(
    {
      image: new RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: 30,
        radius2: 0,
        angle: 0,
      }),
    }),
  new Style(
    {
      image: new CircleStyle({
        radius: 15,
        fill: fill,
        stroke: stroke,
      })
    })]
}

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [geoMarker],
  }),
  style: function (feature) {
    return styles[feature.get('type')];
  },
});
const position = geoMarker.getGeometry().clone();

map.addLayer(vectorLayer);
*/

export default map;
/*
let distance = 0;
let lastTime;
let newEnd = false;
let landmarkFound = false;

function moveFeature(event) {

  const speed = 900;
  const time = event.frameState.time;
  distance = (distance + (speed) / 150000) % 2;
  lastTime = time;

  const currentCoordinate = route.getCoordinateAt(
    distance
  );

  if (distance > 1) {
    stopAnimation();

  }  // stop at end
  else {
    position.setCoordinates(currentCoordinate);
    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(styles.geoMarker[0]);
    vectorContext.drawGeometry(position);

    vectorContext.setStyle(styles.geoMarker[1]);
    vectorContext.drawGeometry(position);
    // tell OpenLayers to continue the postrender animation
    map.render();
  }


}

export function startAnimation() {
  lastTime = Date.now();
  newEnd = false;
  vectorLayer.on('postrender', moveFeature);
  // hide geoMarker and trigger map render through change event
  geoMarker.setGeometry(null);

}

function stopAnimation(coords) {
  if(coords && landmarkFound === false) {
    landmarkFound = true;
    geoMarker.setGeometry(position);
  
    createNewEndPoint(landmarkFound,coords);
    newEnd = false;
  }
  else if(landmarkFound === true) {
    console.log("do nothing")
  }
  else {
    geoMarker.setGeometry(position);
  
    createNewEndPoint(landmarkFound,coords);
    newEnd = true;
  }
  


}

function createNewEndPoint(landmarkFound,coords) {
  let lat;
  let lng;
  if (landmarkFound === true && coords)  {
    lat = coords[1];
    lng = coords[0];

  }
  else if(landmarkFound === false) {
    // = 57.927300 - (Math.random() * 8.25612)
    lng = -10.4 + (Math.random() * 8.68)
    if(lng<-7.5) {
      lat = 55.35 - (Math.random() * 3.9);
    }
    else if(lng<-1.04) {
      lat = 58.65 - (Math.random() * 8.15)
    }
    else  if(lng<0.6) {
      lat = 54.5 - (Math.random() * 4)
    }
    else {
      lat = 53 - (Math.random() * 2.3)
    }

  }
  if (newEnd === true) {
    var newRoute = new LineString([[lng, lat]]);
    newRoute.transform('EPSG:4326', 'EPSG:3857');
    route.flatCoordinates.push(newRoute.flatCoordinates[0]);
    route.flatCoordinates.push(newRoute.flatCoordinates[1]);
    route.flatCoordinates.shift();
    route.flatCoordinates.shift();
    newEnd = false;
    distance = 0;
    startAnimation();

  }
}*/

export async function RecenterMap(coords, zoom, radius, landmark, geojson, clue) {

  let mouseZoom = new MouseWheelZoom({ active: true })
  let clickZoom = new DoubleClickZoom({ active: true })
  ////also add zoom in and out buttons (and keyboard zoom)

  //stopAnimation(coords);

  map.addInteraction(mouseZoom)
  map.addInteraction(clickZoom)

  let interactions = map.getInteractions();
  interactions.forEach((interaction) => {
    if (interaction === "MouseWheelZoom") {
      interaction.setActive(false);
    }
  });
  await drawSearchArea(radius, landmark, coords)
  await drawLandmarkBounds(geojson, landmark, clue)

  await map.getView().animate({
    zoom: zoom,
    center: fromLonLat(coords),
    duration: 2000
  })

  setTimeout(function () {
    document.getElementsByClassName("clue-message")[0].innerHTML = clue;
  }, 2500);
}





function drawSearchArea(radius, landmark, coords) {

  var circle = new Circle(fromLonLat(coords), radius)
  var circleFeature = new Feature(circle);

  var vectorSource = new VectorSource({
    features: [circleFeature]
  })

  var vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    }),
    name: landmark + "_circle"

  })
  map.addLayer(vectorLayer);
}


function drawLandmarkBounds(geojson, landmark, clue) {
  var area = [];
  var coordinates = geojson.coordinates[0];
  for (let i = 0; i < coordinates.length; i++) {
    var coordinate = coordinates[i];
    area.push(coordinate);
  }
  var polygon = new Polygon([area]);
  polygon.transform('EPSG:4326', 'EPSG:3857');
  var feature = new Feature(polygon);

  // Create vector source and the feature to it.
  var vectorSource = new VectorSource();
  vectorSource.addFeature(feature);

  // Create vector layer attached to the vector source.
  var vectorLayer = new VectorLayer({
    source: vectorSource
  });

  var styleNotFound = new Style({
    stroke: new Stroke({
      color: 'transparent',
      width: 1
    }),
    fill: new Fill({
      color: 'transparent'
    })
  });

  feature.setStyle(styleNotFound);
  feature.setProperties({ "name": landmark })

  // Add the vector layer to the map.
  map.addLayer(vectorLayer);

  var selectClick = new Select({
    condition: click,
  });
  map.addInteraction(selectClick);
  selectClick.on('select', function (e) {
    if (e != null) {
      checkLandmarkClick(e, landmark);
    }
  });

}


function checkLandmarkClick(e, landmark) {
  var selectedFeatures = e.target.getFeatures().getArray();
  if (selectedFeatures.length > 0) {
    if (selectedFeatures[0].values_.name === landmark) {
      var styleNotFound = new Style({
        stroke: new Stroke({
          color: 'transparent',
          width: 1
        }),
        fill: new Fill({
          color: 'transparent'
        })
      });
      selectedFeatures[0].setStyle(styleNotFound);
      playerFoundLandmark(landmark,false)
    }
  }
}

export async function playerFoundLandmark(landmark,firstRun) {
  //actions
  //reset this player's hints
  //add score
  //put up background over map
  //send message to all players that player has found landmark
  //increment number of times landmark has been found (when at 3 change the question and display trophies) --- do the cut off through subscribe
  const { data: { user } } = await database.getUser(); //get the user
  const userId = user.id;
  const player = await database.getPlayerDetails(userId); // get the player's name etc.
  let multiplier = await database.checkQuestionNumber(); //see what question wer are on
  const timesFound = await database.foundLandmark(player.name); //add player to array of players who found the landmark (only if player already not in array) 
  let position = timesFound.indexOf(player.name)+1;
  multiplier = Math.floor(multiplier / timesFound.length);
  //only want to run this if the player hasn't already got the points for it
  if(firstRun===true) {
    await database.setScore(userId, 15 * multiplier);
    await database.resetPlayer(userId, landmark.toLowerCase(),position);  
  }
  document.getElementById("landmark-image").src = `./images/${landmark.replace(/ /g, "-").toLowerCase()}-large.jpg`;
  document.getElementById("landmark-image").style.display = "block";
  document.getElementsByClassName("clue-message")[0].innerHTML = `Well done! You found ${titleCase(landmark)}!`;
  let trophy = document.getElementById("trophy");
  let award;
  switch(timesFound.length) {
    case 1: award="gold"; break;
    case 2: award="silver"; break;
    default: award="bronze";break
  }
  trophy.src=`./images/${award}.png`;
  trophy.style.display = "block";

  if(firstRun===false) {
    for(let i=1;i<4;i++) {
      document.getElementById(`clue-mark-${i}`).innerHTML = "check";
      document.getElementById(`clue-input-${i}`).setAttribute("disabled","true")
      document.getElementById(`guess-${i}`).setAttribute("disabled","true")
      document.getElementById(`hint-${i}`).setAttribute("disabled","true")
      document.getElementById(`clue-mark-${i}`).classList.add("correct");
  
    }

  }

  //document.getElementById("scanner").style.display = "none";
}


function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}