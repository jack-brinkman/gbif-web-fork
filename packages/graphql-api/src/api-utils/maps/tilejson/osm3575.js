module.exports = {
    "type": "raster",
    "tiles": [
        "https://tile.gbif.org/3575/omt/{z}/{x}/{y}@{{pixelRatio}}x.png?style=gbif-natural-{{language}}"
    ],
    "projection": "EPSG:3575",
    "wrapX": false,
    "maxZoom": 17,
    "attributions": ["GBIF OSM"],
    "tileSize": 512,
    "tilegridOptions": {
        "extent": [
            -9009964.78821664,
            -9009964.78821664,
            9009964.78821664,
            9009964.78821664
        ],
        "origin": [
            -9009964.78821664,
            9009964.78821664
        ],
        "minZoom": 0,
        "maxZoom": 13,
        "resolutions": [
            35195.17495397125,
            17597.587476985624,
            8798.793738492812,
            4399.396869246406,
            2199.698434623203,
            1099.8492173116015,
            549.9246086558007,
            274.96230432790037,
            137.48115216395018,
            68.74057608197509,
            34.370288040987546,
            17.185144020493773,
            8.592572010246887,
            4.296286005123443
        ],
        "tileSize": 512
    },
    "extent": [
        -9009964.78821664,
        -9009964.78821664,
        9009964.78821664,
        9009964.78821664
    ]
}