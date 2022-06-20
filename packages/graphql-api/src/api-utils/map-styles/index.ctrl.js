const express = require('express');
const router = express.Router();
var Mustache = require('mustache');
// const satellite = require('./experiments/satellite');
const maptilerSatellite = require('./experiments/maptilerSatellite');
const bingSatellite = require('./experiments/bingSatellite');
const hillshade = require('./experiments/hillshade');
const epsg4326 = require('./experiments/4326');

module.exports = function (app) {
    app.use('/unstable-api/map-styles', router);
};

router.get('/bing-satellite', (req, res, next) => {
    const renderedTemplate = Mustache.render(JSON.stringify(bingSatellite), req.query);
    res.json(JSON.parse(renderedTemplate));
});

router.get('/maptiler-satellite', (req, res, next) => {
    const renderedTemplate = Mustache.render(JSON.stringify(maptilerSatellite), req.query);
    res.json(JSON.parse(renderedTemplate));
});

router.get('/4326', (req, res, next) => {
    res.json(epsg4326);
});

router.get('/hillshade', (req, res, next) => {
    res.json(hillshade);
});