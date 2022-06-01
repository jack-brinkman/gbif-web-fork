import React, { Component } from "react";
import createBasicBaseMapStyle from './openlayers/styles/basicBaseMap';
import env from '../../../../../.env.json';
import { projections } from './openlayers/projections';

import OlMap from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Icon, Text, Circle } from 'ol/style';
import { VectorTile as VectorTileLayer } from 'ol/layer';
import { VectorTile as VectorTileSource } from 'ol/source';
import { MVT as MVTFormat } from 'ol/format';
import * as olInteraction from 'ol/interaction';
// const WebGLTile = ol.layer.WebGLTile;

// const projectionEPSG = '3857';// mercator
const projectionEPSG = '3031';// antarctic;

var interactions = olInteraction.defaults({altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: true});

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
    // const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    // mapboxgl.accessToken = env.MAPBOX_KEY;
    // this.map = new mapboxgl.Map({
    //   container: this.myRef.current,
    //   style: `mapbox://styles/mapbox/${mapStyle}`,
    //   zoom: sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0,
    //   center: [sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0, sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0]
    // });
    // this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    // this.map.on("load", this.addLayer);


    // const currentProjection = projections.EPSG_3031;
    const currentProjection = projections.EPSG_3031;
    const baseLayer = currentProjection.getBaseLayer();
    
    this.map = new OlMap({
      target: this.myRef.current,
      layers: [baseLayer],
      view: currentProjection.getView(0, 0, 1),//x,x,zoom
      interactions,
      // logo: false,
    });
    this.mapLoaded = true;
    this.addLayer();
  }

  componentWillUnmount() {
    // https://github.com/openlayers/openlayers/issues/9556#issuecomment-493190400
    this.map.setTarget(null);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    // if (prevProps.theme !== this.props.theme && this.mapLoaded) {
    //   const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    //   this.map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
    //   this.map.on('style.load', () => {
    //     this.updateLayer();
    //   });
    // }
  }

  updateLayer() {
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === 'occurrences')
      .forEach(layer => this.map.removeLayer(layer));
    this.addLayer();
  }

  onPointClick(pointData) {
    this.props.onPointClick(pointData);
  }

  addLayer() {
    const currentProjection = projections.EPSG_3031;
    const occurrenceLayer = currentProjection.getAdhocLayer({
      style: 'scaled.circles',
      mode: 'GEO_CENTROID',
      squareSize: 512,
      predicateHash: this.props.predicateHash,
      onError: e => {
        // there seem to be no simple way to get the statuscode, so we will just reregister on any type of error
        if (this.props.registerPredicate) {
          this.props.registerPredicate();
        }
      }
    });
    this.map.addLayer(occurrenceLayer);
    // how to add a layer below e.g. labels on the basemap?

    const map = this.map

    map.on('moveend', function(e) {
      const {center, zoom} = map.getView().getState();
      console.log(center);
      sessionStorage.setItem('mapZoom', zoom);
      sessionStorage.setItem('mapLng', center[0]);
      sessionStorage.setItem('mapLat', center[1]);
    });
    // const map = this.map
    // if (!this.mapLoaded) {
    //   // remember map position
    //   map.on('zoomend', function () {
    //     const center = map.getCenter();
    //     sessionStorage.setItem('mapZoom', map.getZoom());
    //     sessionStorage.setItem('mapLng', center.lng);
    //     sessionStorage.setItem('mapLat', center.lat);
    //   });
    //   map.on('moveend', function () {
    //     const center = map.getCenter();
    //     sessionStorage.setItem('mapZoom', map.getZoom());
    //     sessionStorage.setItem('mapLng', center.lng);
    //     sessionStorage.setItem('mapLat', center.lat);
    //   });

    //   map.on('mouseenter', 'occurrences', function (e) {
    //     // Change the cursor style as a UI indicator.
    //     map.getCanvas().style.cursor = 'pointer';
    //   });

    const pointClickHandler = this.onPointClick;
    const clickHandler = this.props.onMapClick;
    map.on('singleclick', event => {
      occurrenceLayer.getFeatures(event.pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        if (feature) {
          const properties = feature.properties_;
          pointClickHandler({ geohash: properties.geohash, count: properties.total });
        } else if (clickHandler) {
          clickHandler();
        }
      });
    });
    //   map.on('click', 'occurrences', e => {
    //     this.onPointClick({ geohash: e.features[0].properties.geohash, count: e.features[0].properties.count });
    //     e.preventDefault();
    //   });

    map.on('pointermove', function(e){
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel, {layerFilter: l => l.values_.name === 'occurrences'});
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    //   map.on('click', e => {
    //     if (!e._defaultPrevented && this.props.onMapClick) this.props.onMapClick();
    //   });

    //   map.on('error', e => {
    //     if (e?.error?.status === 400 && this.props.registerPredicate) {
    //       this.props.registerPredicate();
    //     }
    //   });
    // }
    // this.mapLoaded = true;
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, ...props } = this.props;
    return <div ref={this.myRef} {...props} />
  }
}

export default Map;
