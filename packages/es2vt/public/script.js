new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions:
      '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
      '© <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
    format: new MVT(),
    url:
      'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
      '{z}/{x}/{y}.vector.pbf?access_token=' +
      key,
  }),
  style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),
})