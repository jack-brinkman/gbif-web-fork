const express = require('express');
const router = express.Router();
var Mustache = require('mustache');
// const satellite = require('./experiments/satellite');
const maptilerSatellite = require('./experiments/maptilerSatellite');
const bingSatellite = require('./experiments/bingSatellite');
const hillshade = require('./experiments/hillshade');
const positron = require('./experiments/positron');
const positronMercator = require('./experiments/positron_mercator');
const positron4326 = require('./experiments/positron_4326_raster');
const positron3031 = require('./experiments/positron_3031');
const epsg4326 = require('./experiments/4326');
const gbifNatural3575 = require('./3575/gbif-natural.json');

const defaultValues = {
    pixelRatio: 1,
    projection: '3857',
    language: 'en'
};

module.exports = function (app) {
    app.use('/unstable-api/map-styles', router);
};

function returnTemplate(req, res, next, template, defaultOverwrites) {
    const variables = Object.assign({}, defaultValues, defaultOverwrites, req.query);
    const renderedTemplate = Mustache.render(JSON.stringify(template), variables);
    res.json(JSON.parse(renderedTemplate));
}

router.get('/bing-satellite', (req, res, next) => {
    returnTemplate(req, res, next, bingSatellite);
});

router.get('/maptiler-satellite', (req, res, next) => {
    returnTemplate(req, res, next, maptilerSatellite);
});

router.get('/4326', (req, res, next) => {
    returnTemplate(req, res, next, epsg4326);
});

router.get('/hillshade', (req, res, next) => {
    returnTemplate(req, res, next, hillshade);
});

router.get('/positron', (req, res, next) => {
    returnTemplate(req, res, next, positron);
});

router.get('/positron-mercator', (req, res, next) => {
    returnTemplate(req, res, next, positronMercator);
});

router.get('/positron-4326', (req, res, next) => {
    returnTemplate(req, res, next, positron4326);
});

router.get('/positron-3031', (req, res, next) => {
    returnTemplate(req, res, next, positron3031);
});

router.get('/3575/gbif-natural', (req, res, next) => {
    returnTemplate(req, res, next, gbifNatural3575);
});