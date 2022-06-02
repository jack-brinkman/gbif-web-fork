import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';
import { getLayerConfig } from './getLayerConfig';
import env from '../../../../../.env.json';

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
    mapboxgl.accessToken = env.MAPBOX_KEY;
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      // style: `mapbox://styles/mapbox/${mapStyle}`,
      style: {
        'version': 8,
        'sources': {
          'raster-tiles': {
            'type': 'raster',
            'tiles': [
              // 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg' // http://maps.stamen.com/#toner/12/37.7706/-122.3782
              // 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png' // http://maps.stamen.com/#toner/12/37.7706/-122.3782
              'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Xvg05zabkgUuQMSKiq2s' // https://cloud.maptiler.com/maps/hybrid/
            ],
            'tileSize': 256,
            'attribution':
              'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
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
      },
      // style: 'https://api.maptiler.com/maps/hybrid/style.json?key=Xvg05zabkgUuQMSKiq2s',
      zoom: sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0,
      center: [sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0, sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0]
    });
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
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
        sessionStorage.setItem('mapZoom', map.getZoom());
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
      map.on('moveend', function () {
        const center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom());
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
