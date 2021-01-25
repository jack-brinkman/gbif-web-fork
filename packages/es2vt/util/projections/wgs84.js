import TileGrid from 'ol/tilegrid/TileGrid';
import * as olProj from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

var tileSize = 256;
var maxZoom = 18;
var extent = 180.0;
var resolutions = Array(maxZoom + 1).fill().map(function (_, i) {
  return extent / tileSize / Math.pow(2, i);
});

proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
register(proj4);

const tileGrid = new TileGrid({
  extent: olProj.get('EPSG:4326').getExtent(),
  minZoom: 0,
  maxZoom: maxZoom,
  resolutions: resolutions,
  tileSize: tileSize
});

// const e = tileGrid.getTileCoordExtent([ 6, 68, 12 ]);
// console.log(e);
// console.log(tileGrid.getTileCoordForCoordAndZ([12, 55], 6));

// 2 public functions needed
// XYZ tile => bounding box

// lat lon zoom => mapbox tile coordinates
// use lat, long, zoom => XYZ coordinates

export function tile2boundingBox({ x, y, z }) {
  const [west, south, east, north] = tileGrid.getTileCoordExtent([z, x, y]);// z zoom, x column, y row
  return {
    north,
    south,
    east,
    west
  }
}

export function getVectorTileCoordinates(pointLat, pointLon, tileX, tileY, zoom, vectorTileExtend) {
  const [zZoom, xColumn, yRow] = tileGrid.getTileCoordForCoordAndZ([pointLon, pointLat], zoom);
  const { north, south, east, west } = tile2boundingBox({
    x: xColumn,
    y: yRow,
    z: zZoom
  });

  // if point located on other tile, than the queried one, then reject it
  if (xColumn !== tileX || yRow !== tileY) return;

  // get relative coordinates on tile
  return {
    x: vectorTileExtend * (pointLat - south) / (north - south),
    y: vectorTileExtend * (pointLon - west) / (east - west),
  };
}

// console.log(getVectorTileCoordinates(53.8375, 11.85, 68, 12, 6, 100));