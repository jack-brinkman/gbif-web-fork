import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';
import env from '../../../../../.env.json';
import mapStyle from './openlayers/styles/klokantech2.json';

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);
    zoom -= 1;

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-85, lat), 85);

    console.log(this.props.basemap);
    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      // style: `mapbox://styles/mapbox/${mapStyle}`,
      // style: 'https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA',
      style: this.getStyle(),
      // style: 'https://api.maptiler.com/maps/hybrid/style.json?key=Xvg05zabkgUuQMSKiq2s',
      zoom,
      center: [lng, lat]
    });
    // this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    if (this.map) this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    if (prevProps.theme !== this.props.theme && this.mapLoaded) {
      const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
      this.map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
      this.map.on('style.load', () => {
        this.updateLayer();
      });
    }
    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.map.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.map.zoomOut();
      }
    }
    if (prevProps.basemap !== this.props.basemap && this.mapLoaded) {
      var layer = this.map.getSource("simple-tiles");
      if (layer) {
        this.map.removeLayer("simple-tiles");
        this.map.removeSource("raster-tiles");
      }
      this.map.setStyle(this.getStyle());
      this.addLayer();
    }
  }

  getStyle() {
    // this.map.setStyle();
    // return 'http://localhost:3001/map/styles/hybrid.json';//mapStyle;
    return 'http://localhost:3001/map/styles/hillshade.json';//mapStyle;
    return {
      'version': 8,
      'sources': {
        'raster-tiles': {
          'type': 'raster',
          'tiles': [
            // 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', // http://maps.stamen.com/#toner/12/37.7706/-122.3782
            // 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', // http://maps.stamen.com/#toner/12/37.7706/-122.3782
            // 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Xvg05zabkgUuQMSKiq2s', // https://cloud.maptiler.com/maps/hybrid/
            // 'https://tile.gbif.org/3857/omt/{z}/{x}/{y}@2x.png?style=osm-bright-en&srs=EPSG%3A3857',
            // 'https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',// https://www.arcgis.com/home/webmap/viewer.html?featurecollection=http%3A%2F%2Fcertmapper.cr.usgs.gov%2Fserver%2Frest%2Fservices%2Fgeology%2Feurope%2Fmapserver%3Ff%3Djson%26option%3Dfootprints&supportsProjection=true&supportsJSONP=true
            // 'https://mrdata.usgs.gov/mapcache/wmts/?layer=sgmc2&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',// https://codepen.io/hofft/pen/porNMbM
            this.props.basemap.basemap.url
          ],
          'tileSize': 256,
          'attribution':
            // 'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            this.props.basemap.basemap.attribution
        }
      },
      'layers': [
        {
          'id': 'simple-tiles',
          'type': 'raster',
          'source': 'raster-tiles',
          'minzoom': 0,
          'maxzoom': 22
        }
      ]
    }
  }
  updateLayer() {
    var layer = this.map.getSource("occurrences");
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    // this.map.setPaintProperty(
    //   'simple-tiles',
    //   'raster-opacity',
    //   0.8
    // );





    // this.map.addSource("venezuela", {
    //   type: "vector",
    //   maxzoom: 10,
    //   tiles: ["https://geoportalp-files.s3-us-east-2.amazonaws.com/vtiles/venezuela/{z}/{x}/{y}.pbf"],
    //   attribution: "IGVSB"
    // });
    // this.map.addLayer({
    //   id: "venezuela",
    //   type: "line",
    //   source: "venezuela",
    //   "source-layer": "venezuela",
    //   paint: {
    //     "line-color": "#ff0000",
    //     "line-dasharray": [2, 3],
    //     "line-width": 2
    //   }
    // });

    // this.map.addLayer({
    //   id: "esequibo-layer",
    //   type: "fill",
    //   source: "venezuela",
    //   "source-layer": "venezuela",
    //   layout: {},
    //   filter: ["==", "NAME", "Territorio Esequibo"],
    //   paint: {
    //     "fill-pattern": "pattern",
    //     "fill-opacity": .3
    //   }
    // });

    var tileString = `${env.API_V2}/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&srs=EPSG%3A3857&squareSize=256&predicateHash=${this.props.predicateHash}&${this.props.q ? `&q=${this.props.q} ` : ''}`;
    this.map.addLayer(
      getLayerConfig({ tileString, theme: this.props.theme }),
      // "poi-scalerank2"
    );

    const map = this.map
    if (!this.mapLoaded) {
      // remember map position
      map.on('zoomend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom() + 1);
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom() + 1);
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });

      map.on('mouseenter', 'occurrences', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('click', 'occurrences', e => {
        this.onPointClick({ geohash: e.features[0].properties.geohash, count: e.features[0].properties.count });
        e.preventDefault();
      });

      map.on('mouseleave', 'occurrences', function () {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', e => {
        if (!e._defaultPrevented && this.props.onMapClick) this.props.onMapClick();
      });

      map.on('error', e => {
        if (e?.error?.status === 400 && this.props.registerPredicate) {
          this.props.registerPredicate();
        }
      });
    }
    this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, style, className, ...props } = this.props;
    return <div ref={this.myRef} {...{ style, className }} />
  }
}

export default Map;
