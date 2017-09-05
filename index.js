'use strict';

const PolygonLookup = require('polygon-lookup');

/**
 * Pre computes an R-Tree from a GeoJSON Object and uses the data future queries
 * For an example @see {@link https://github.com/busrapidohq/world-countries-boundaries}
 * @param  {Object} geoJson Valid GeoJSON FeatureCollection
 * @return
 */
module.exports.use = function (geoJson) {
  this.worldGeojson = geoJson;
  this.worldLookup = new PolygonLookup(this.worldGeojson);
};

/**
 * Searches for every country which contains the point (lat, lng) and
 * returns an array of ISO 3166 alpha-3 country code for the geographic coordinates
 * @param {Number} lat  latitude of the point
 * @param {Number} lng  longitude of the point
 * @return {Array} an array of String
 */
module.exports.get = function (lat, lng) {
  return new Promise((resolve, reject) => {
    if (this.worldGeojson === undefined) {
      reject(new Error('No geographical data loaded'));
    }
    const countries = this.worldLookup.search(lng, lat, -1);
    resolve(countries.features.map(f => f.properties.ISO_A3));
  });
};
