import React, { Component } from "react";
import createBasicBaseMapStyle from './openlayers/styles/basicBaseMap';
import env from '../../../../../.env.json';
import { projections } from './openlayers/projections';

import OlMap from 'ol/Map';
import * as olInteraction from 'ol/interaction';

var interactions = olInteraction.defaults({ altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: true });

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


    // TODO: handle controls, set zoom, center from storage/defaults and generate style from theme
    const currentProjection = projections[this.props.projection || 'EPSG_3031'];
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

    if (prevProps.projection !== this.props.projection && this.mapLoaded) {
      this.updateProjection();
    }

    // TODO: monitor theme and update maps accordingly
    // if (prevProps.theme !== this.props.theme && this.mapLoaded) {
    //   const mapStyle = this.props.theme.darkTheme ? 'dark-v9' : 'light-v9';
    //   this.map.setStyle(`mapbox://styles/mapbox/${mapStyle}`);
    //   this.map.on('style.load', () => {
    //     this.updateLayer();
    //   });
    // }
  }

  removeLayer(name) {
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === name)
      .forEach(layer => this.map.removeLayer(layer));
  }

  updateProjection() {
    // this.removeLayer('baseLayer');
    // this.removeLayer('occurrences');
    this.map.getLayers().clear()
    const currentProjection = projections[this.props.projection || 'EPSG_3031'];
    console.log(currentProjection.name);
    const baseLayer = currentProjection.getBaseLayer();
    this.map.setView(currentProjection.getView(0, 0, 1));
    if (currentProjection.fitExtent) {
      this.map.getView().fit(currentProjection.fitExtent, { constrainResolution: false, maxZoom: 12, minZoom: 0 });
    }
    this.map.addLayer(baseLayer);
    this.addLayer();
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
    const currentProjection = projections[this.props.projection || 'EPSG_3031'];
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

    map.on('moveend', function (e) {
      const { center, zoom } = map.getView().getState();
      sessionStorage.setItem('mapZoom', zoom);
      sessionStorage.setItem('mapLng', center[0]);
      sessionStorage.setItem('mapLat', center[1]);
    });

    // TODO: find a way to store current extent in a way it can be reused. Should ideallky be the same format as for mapbox: center, zoom
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

    const pointClickHandler = this.onPointClick;
    const clickHandler = this.props.onMapClick;
    map.on('singleclick', event => {
      // todo : hover and click do not agree on wether there is a point or not
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

    map.on('pointermove', function (e) {
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel, { layerFilter: l => l.values_.name === 'occurrences' });
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }

  render() {
    const { query, onMapClick, onPointClick, predicateHash, ...props } = this.props;
    return <div ref={this.myRef} {...props} />
  }
}

export default Map;
