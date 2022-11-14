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
