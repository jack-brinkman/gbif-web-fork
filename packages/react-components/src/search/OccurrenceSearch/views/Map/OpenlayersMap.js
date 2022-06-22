import React, { Component } from "react";
import createBasicBaseMapStyle from './openlayers/styles/basicBaseMap';
import env from '../../../../../.env.json';
import { projections } from './openlayers/projections';

import OlMap from 'ol/Map';
import { defaults as olControlDefaults } from 'ol/control';
import * as olInteraction from 'ol/interaction';
import { transform } from 'ol/proj';
import View from 'ol/View';
import { applyStyle, applyBackground, apply, stylefunction } from 'ol-mapbox-style';
import { VectorTile as VectorTileSource } from 'ol/source';
import { TileImage as TileImageSource } from 'ol/source';
import WMTSSource from 'ol/source/WMTS';

import { Tile as TileLayer } from 'ol/layer';
import { MVT as MVTFormat } from 'ol/format';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileWMS from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';


import positron from './openlayers/styles/positron.json';
import darkMatter from './openlayers/styles/darkMatter.json';
import mapboxBright from './openlayers/styles/mapboxBright.json';
import klokantech from './openlayers/styles/klokantech.json';
// import mapboxBright from './openlayers/styles/klokantech2.json';
const token = 'pk.eyJ1IjoiZ2JpZiIsImEiOiJja3VmZm50Z3kxcm1vMnBtdnBmeGd5cm9hIn0.M2z2n9QP9fRHZUCw9vbgOA';
var interactions = olInteraction.defaults({ altShiftDragRotate: false, pinchRotate: false, mouseWheelZoom: true });

const mapStyles = {
  positron,
  darkMatter,
  mapboxBright,
  klokantech
};

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
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];

    const mapPos = this.getStoredMapPosition();

    let mapConfig = {
      target: this.myRef.current,
      view: currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom),
      controls: olControlDefaults({ zoom: false, attribution: true }),
      interactions,
    };
    this.map = new OlMap(mapConfig);
    this.updateMapLayers();
    this.mapLoaded = true;
    this.addLayer();
  }

  componentWillUnmount() {
    // https://github.com/openlayers/openlayers/issues/9556#issuecomment-493190400
    if (this.map) {
      this.map.setTarget(null);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }

    if (prevProps.mapConfig !== this.props.mapConfig && this.mapLoaded) {
      this.updateMapLayers();
    }

    if (prevProps.latestEvent !== this.props.latestEvent && this.mapLoaded) {
      if (this.props.latestEvent?.type === 'ZOOM_IN') {
        this.zoomIn();
      } else if (this.props.latestEvent?.type === 'ZOOM_OUT') {
        this.zoomOut();
      }
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

  getStoredMapPosition() {
    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];

    let zoom = sessionStorage.getItem('mapZoom') || this.props.defaultMapSettings?.zoom || 0;
    zoom = Math.min(Math.max(0, zoom), 20);

    let lng = sessionStorage.getItem('mapLng') || this.props.defaultMapSettings?.lng || 0;
    lng = Math.min(Math.max(-180, lng), 180);

    let lat = sessionStorage.getItem('mapLat') || this.props.defaultMapSettings?.lat || 0;
    lat = Math.min(Math.max(-90, lat), 90);
    // const reprojectedCenter = transform([lng, lat], 'EPSG:4326', currentProjection.srs);
    return {
      lat,//: reprojectedCenter[1], 
      lng,//: reprojectedCenter[0], 
      zoom
    };
  }

  zoomIn() {
    var view = this.map.getView();
    view.setZoom(view.getZoom() + 1);
  };

  zoomOut() {
    var view = this.map.getView();
    view.setZoom(view.getZoom() - 1);
  };

  removeLayer(name) {
    this.map.getLayers().getArray()
      .filter(layer => layer.get('name') === name)
      .forEach(layer => this.map.removeLayer(layer));
  }

  async updateMapLayers() {
    const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
    const currentProjection = projections[epsg];
    this.setState({ epsg })

    this.map.getLayers().clear();
    // this.updateProjection();

    // update projection
    // const mapPos = this.getStoredMapPosition();
    // const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    // this.map.setView(newView);


    const basemapStyle = this.props.mapConfig?.basemapStyle || 'klokantech';
    const layerStyle = mapStyles[basemapStyle];
    if (layerStyle) {
      const baseLayer = currentProjection.getBaseLayer();
      const resolutions = baseLayer.getSource().getTileGrid().getResolutions();
      applyBackground(baseLayer, layerStyle, 'openmaptiles');
      applyStyle(baseLayer, layerStyle, 'openmaptiles', undefined, resolutions);
      this.map.addLayer(baseLayer);
    } else if (epsg !== 'EPSG_3857') {

      const styleResponse = await fetch(this.props.mapConfig?.basemapStyle).then(response => response.json());

      if (!styleResponse?.metadata?.['gb:reproject']) {
        const baseLayer = currentProjection.getBaseLayer();
        const resolutions = baseLayer.getSource().getTileGrid().getResolutions();
        applyBackground(baseLayer, styleResponse, 'openmaptiles');
        stylefunction(baseLayer, styleResponse, 'openmaptiles', resolutions);
        this.map.addLayer(baseLayer);
      } else {
        // if this map style is intended to be reprojected then continue
        await apply(this.map, styleResponse);

        const mapPos = this.getStoredMapPosition();
        const map = this.map;

        const mapboxStyle = this.map.get('mapbox-style');
        this.map.getLayers().forEach(function (layer) {
          const mapboxSource = layer.get('mapbox-source');
          if (mapboxSource) {
            const sourceConfig = mapboxStyle.sources[mapboxSource];
            if (sourceConfig.type === 'vector') {
              const source = layer.getSource();
              const sourceConfig = mapboxStyle.sources[mapboxSource];
              layer.setSource(
                new VectorTileSource({
                  format: new MVTFormat(),
                  projection: sourceConfig.projection,
                  urls: source.getUrls(),
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  wrapX: sourceConfig.wrapX,
                  attributions: sourceConfig.attributions
                })
              );

              stylefunction(layer, styleResponse, mapboxSource, sourceConfig.tilegridOptions.resolutions);

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }
            if (sourceConfig.type === 'raster') {
              const source = layer.getSource();
              layer.setSource(
                new TileImageSource({
                  projection: sourceConfig.projection,
                  urls: sourceConfig.tiles,
                  tileGrid: new TileGrid(sourceConfig.tilegridOptions),
                  tilePixelRatio: 2,
                  wrapX: sourceConfig.wrapX,
                  maxZoom: sourceConfig.maxZoom,
                  attributions: sourceConfig.attributions
                })
              );
              if (sourceConfig.extent) {
                layer.setExtent(sourceConfig.extent);
              }

              // update the view projection to match the data projection
              const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
              map.setView(newView);
            }
          }
        });
      }

    } else {
      await apply(this.map, this.props.mapConfig?.basemapStyle || 'http://localhost:3001/map/styles/darkMatter.json');
    }

    // update projection
    const mapPos = this.getStoredMapPosition();
    const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
    this.map.setView(newView);

    this.addLayer();
  }

  // async updateProjection() {
  //   const epsg = this.props.mapConfig?.projection || 'EPSG_3031';
  //   const currentProjection = projections[epsg];

  //   const mapPos = this.getStoredMapPosition();
  //   const newView = currentProjection.getView(mapPos.lat, mapPos.lng, mapPos.zoom);
  //   this.map.setView(newView);
  // }

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

    const currentProjection = projections[this.props.mapConfig?.projection || 'EPSG_3031'];
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

    // how to add a layer below e.g. labels on the basemap? // you can insert at specific indices, but the problem is that the basemap are collapsed into one layer
    // occurrenceLayer.setZIndex(0);
    this.map.addLayer(occurrenceLayer);

    const map = this.map

    map.on('moveend', function (e) {
      if (this.refreshingView) return;
      const { center, zoom } = map.getView().getState();
      const reprojectedCenter = transform(center, currentProjection.srs, 'EPSG:4326');
      sessionStorage.setItem('mapZoom', zoom);
      sessionStorage.setItem('mapLng', reprojectedCenter[0]);
      sessionStorage.setItem('mapLat', reprojectedCenter[1]);
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
