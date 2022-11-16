import './main.css';

// BEGIN-DATABASE
const missionsData = {
  '101': { name: 'nyoba', data: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.373491,-7.73567],[110.417636,-7.771751],[110.399772,-7.778728]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.3405,-7.74401],[110.39217,-7.795746],[110.333118,-7.788939],[110.376892,-7.75337],[110.3405,-7.74401]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.372429,-7.796427],[110.372429,-7.74384],[110.446587,-7.74384],[110.446587,-7.796427],[110.372429,-7.796427]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.308056,-7.746222]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.361786,-7.719331]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.313892,-7.798979]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.367279,-7.815656],[110.453281,-7.821101],[110.403671,-7.832672]]}}]} },
  '102': { name: 'Shapes', data: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.316467,-7.721884],[110.303078,-7.758987],[110.369682,-7.764263],[110.316467,-7.721884]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[110.382042,-7.760008],[110.382042,-7.716267],[110.411568,-7.716267],[110.411568,-7.760008],[110.382042,-7.760008]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.389595,-7.782472]}},{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[110.314751,-7.8],[110.378094,-7.768007],[110.37466,-7.750988],[110.369511,-7.690925],[110.447788,-7.697053],[110.434742,-7.770238]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.497742,-7.788108]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.43869,-7.607079]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.34668,-7.825813]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[110.463066,-7.817985]}}]} },
  '103': { name: 'Empty', data: {"type":"FeatureCollection","features":[]} }
};
// END-DATABASE

const newMissionEl = document.querySelector('.new-mission');
const missionsEl = document.querySelector('.mission-list');
const activeMissionEl = document.querySelector('.active-mission');

const map = L.map('map', { drawControl: true }).setView([-7.770905, 110.377637], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const layers = new L.geoJSON();

map.on("draw:created", (e) => {
  layers.addLayer(e.layer);
})

layers.addTo(map);

function addMissionToDom(id) {
  const mission = missionsData[id];
  missionsEl.insertAdjacentHTML('beforeend', `
    <div class="mission" data-id="${id}">
      <div class="mission-name">${mission.name}</div>
      <div class="mission-actions">
        <div class="mission-edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
        <div class="mission-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></div>
      </div>
    </div>
  `);
}

function setActiveMission(id) {
  activeMissionEl.setAttribute('data-id', id);
  activeMissionEl.innerHTML = `
    <div>${missionsData[id].name}</div>
    <div>
      <div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></div>
      <div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
    </div>
  `;
  layers.clearLayers();
  layers.addData(missionsData[id].data);
}

missionsEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('mission-name')) {
    setActiveMission(e.target.parentNode.getAttribute('data-id'));
  }
})

for (const missionId in missionsData) {
  addMissionToDom(missionId);
}

// fetch('/api/geojson')
// .then(data => {

//   data.json().then(resp => {
//     resp.forEach((element, i) => {
//       console.log(element)
//       $('#listMisi').append(`<li>${i}, <a href="/api/geojson/delete/${i}">Hapus</a></li>`)
//     });
//   })
// })

newMissionEl.addEventListener('click', () => {
  console.log(JSON.stringify(layers.toGeoJSON()));
  // layers.clearLayers();
});
