import 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import Alpine from 'alpinejs';
import './styles.css';

// https://github.com/Leaflet/Leaflet.draw/issues/1026
window.type = true;

const map = L.map('map').setView([-7.770905, 110.377637], 13);

const osmTile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const layers = new L.geoJSON();
layers.addTo(map);

const drawControl = new L.Control.Draw({
  edit: { featureGroup: layers }
});

L.control.layers({
  'osm': osmTile,
  'google': L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; Google',
    subdomains:['mt0','mt1','mt2','mt3']
  }),
  'satellite': L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; Google',
    subdomains:['mt0','mt1','mt2','mt3']
  }),
  'terrain': L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; Google',
    subdomains:['mt0','mt1','mt2','mt3']
  })
}, {
  'layers': layers
}, { collapsed: false }).addTo(map);

setTimeout(() => {
  map.invalidateSize();
});

const mainData = {
  isLoading: false,
  missions: {},
  get missionIdList() {
    return Object.keys(this.missions).sort();
  },
  // ambil daftar id & nama misi yang tersimpan di DB
  async loadMissions() {
    const fetchDbRes = await fetch('/api/list');
    const missionIdList = await fetchDbRes.json();
    const missionList = {};

    for (let id in missionIdList) {
      missionList[id] = {
        name: missionIdList[id],
        loaded: false
      };
    }

    this.missions = missionList;
    this.missionsLoaded = true;
  },
  missionsLoaded: false,
  // ambil data suatu misi dari DB
  async loadMissionData(missionId) {
    this.isLoading = true;
    const fetchDbRes = await fetch('/api/get/' + missionId);
    const missionData = await fetchDbRes.json();

    this.missions[missionId] = {
      ...this.missions[missionId],
      ...missionData,
      loaded: true
    };
    this.isLoading = false;
  },
  activeMission: null, // jangan ubah value secara langsung
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
  unsavedChanges: false,
  newUnsavedChanges() {
    if (!this.unsavedChanges) {
      this.unsavedChanges = true;
    }
  },
  async saveActiveMission() {
    const newGeoJSON = JSON.stringify(layers.toGeoJSON());
    
    this.isLoading = true;
    await fetch('/api/update/' + this.activeMission, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geojson: newGeoJSON })
    });

    this.missions[this.activeMission].geojson = newGeoJSON;
    this.unsavedChanges = false;
    this.isLoading = false;
  },
  async addNewMission() {
    const missionName = prompt('Enter the mission name');
    if (!missionName) return;

    this.isLoading = true;
    const fetchDbRes = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: missionName })
    });
    const { id: missionId } = await fetchDbRes.json();

    this.missions[missionId] = {
      name: missionName
    };
    this.setActiveMission(missionId);
    this.isLoading = false;
  },
  async renameMission(id) {
    const newMissionName = prompt('Enter the new mission name');
    if (!newMissionName) return;

    this.isLoading = true;
    await fetch('/api/update/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMissionName })
    });

    this.missions[id].name = newMissionName;
    this.isLoading = false;
  },
  async deleteMission(id) {
    const confirmDelete = confirm('Are you sure want to delete this mission?');
    if (!confirmDelete) return;

    this.isLoading = true;
    await fetch('/api/delete/' + id, {
      method: 'DELETE'
    });

    if (this.activeMission == id) {
      this.setActiveMission(null);
    }

    delete this.missions[id];
    this.isLoading = false;
  }
};

mainData.init = async function() {
  await this.loadMissions();

  this.$watch('activeMission', async (id, oldId) => {
    this.unsavedChanges = false;
    layers.clearLayers();

    if (!oldId && id) map.addControl(drawControl);
    if (oldId && !id) map.removeControl(drawControl);

    if (id) {
      if (!this.missions[id].loaded) {        
        await this.loadMissionData(id);
      }

      if (this.missions[id].geojson) {
        layers.addData(
          JSON.parse(this.missions[id].geojson)
        );
      }
    }
  });

  map.on("draw:created", (e) => {
    layers.addLayer(e.layer);
    this.newUnsavedChanges();
  });
  
  map.on("draw:edited", () => {
    this.newUnsavedChanges();
  });
  
  map.on("draw:deleted", () => {
    this.newUnsavedChanges();
  });
};

Alpine.data('main', () => mainData);
Alpine.start();

window.Alpine = Alpine;
