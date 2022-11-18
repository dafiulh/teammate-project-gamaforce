import 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import Alpine from 'alpinejs';
import './styles.css';

// BEGIN-DATABASE
const missionsStoredInDB = {
  '101': { name: 'nyoba', geojson: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.373491,-7.73567],[110.417636,-7.771751],[110.399772,-7.778728]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.3405,-7.74401],[110.39217,-7.795746],[110.333118,-7.788939],[110.376892,-7.75337],[110.3405,-7.74401]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.372429,-7.796427],[110.372429,-7.74384],[110.446587,-7.74384],[110.446587,-7.796427],[110.372429,-7.796427]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.308056,-7.746222]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.361786,-7.719331]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.313892,-7.798979]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.367279,-7.815656],[110.453281,-7.821101],[110.403671,-7.832672]]}}]} },
  '102': { name: 'Shapes', geojson: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.316467,-7.721884],[110.303078,-7.758987],[110.369682,-7.764263],[110.316467,-7.721884]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.382042,-7.760008],[110.382042,-7.716267],[110.411568,-7.716267],[110.411568,-7.760008],[110.382042,-7.760008]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.389595,-7.782472]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.314751,-7.8],[110.378094,-7.768007],[110.37466,-7.750988],[110.369511,-7.690925],[110.447788,-7.697053],[110.434742,-7.770238]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.497742,-7.788108]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.43869,-7.607079]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.34668,-7.825813]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.463066,-7.817985]}}]} },
  '103': { name: 'Empty', geojson: {"type":"FeatureCollection","features":[]} }
};
// END-DATABASE

const map = L.map('map', { drawControl: true }).setView([-7.770905, 110.377637], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const layers = new L.geoJSON();
layers.addTo(map);

const mainData = {
  missions: missionsStoredInDB,
  get missionIdList() {
    return Object.keys(this.missions).sort((a, b) => b - a);
  },
  activeMission: null, // don't change the value directly
  unsavedChanges: false,
  setActiveMission(id) {
    if (this.unsavedChanges) {
      const confirmClose = confirm('There are unsaved changes, are you sure want to close?');
      if (!confirmClose) return;
    }

    if (this.activeMission != id) {
      this.activeMission = id;
    } else {
      this.activeMission = null;
    }
  },
  saveActiveMission() {
    // TODO DB
    this.missions[this.activeMission].geojson = layers.toGeoJSON();
    this.unsavedChanges = false;

    alert('Mission saved!');
  },
  addNewMission() {
    const missionName = prompt('Enter the mission name');
    const missionId = Date.now();

    if (missionName) {
      // TODO DB
      this.missions[missionId] = {
        name: missionName,
        geojson: null
      };
      this.setActiveMission(missionId);
    }
  },
  renameMission(id) {
    // TODO DB
    const newMissionName = prompt('Enter the new mission name');
    this.missions[id].name = newMissionName;
  },
  deleteMission(id) {
    const confirmDelete = confirm('Are you sure want to delete this mission?');
    if (!confirmDelete) return;

    if (this.activeMission == id) {
      this.setActiveMission(null);
    }

    // TODO DB
    delete this.missions[id];
  }
};

mainData.init = function() {
  this.$watch('activeMission', () => {
    this.unsavedChanges = false;
    layers.clearLayers();

    if (this.activeMission && this.missions[this.activeMission].geojson) {
      layers.addData(this.missions[this.activeMission].geojson);
    }
  });
};

map.on("draw:created", (e) => {
  layers.addLayer(e.layer);

  if (!mainData.unsavedChanges) {
    mainData.unsavedChanges = true;
  }
});

Alpine.data('main', () => mainData);
Alpine.start();

window.Alpine = Alpine;
