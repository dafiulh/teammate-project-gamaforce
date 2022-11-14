fetch('/api/geojson')
.then(data => {

  data.json().then(resp => {
    resp.forEach((element, i) => {
      console.log(element)
      $('#listMisi').append(`<li>${i}, <a href="/api/geojson/delete/${i}">Hapus</a></li>`)
    });
  })
})
var map = L.map('map', { drawControl: true }).setView([-7.770905, 110.377637], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
// map.addLayer(drawnItems);
map.on("draw:created", e => {
drawnItems.addLayer(e.layer);
})
drawnItems.addTo(map);

// function downloadGeoJSON()

let missonsEl = '';

for (let i = 0; i < 5; i++) {
  missonsEl += `
    <div class="mission">
      <div class="">Misi 1</div>
      <div class="mission-actions">
        <div class="mission-edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></div>
        <div class="mission-delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></div>
      </div>
    </div>
  `;
}

document.getElementById('missions').insertAdjacentHTML('afterbegin', missonsEl);
