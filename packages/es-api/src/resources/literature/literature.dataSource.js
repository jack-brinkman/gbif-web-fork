const elasticsearch = require('elasticsearch');
const _ = require('lodash');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const config = require('../../config');

const host = config.LITERATURE_HOST;
const logLevel = config.OCCURRENCE_LOG_LEVEL;
const searchIndex = 'literature';

const agent = () => new Agent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

var client = new elasticsearch.Client({
  host,
  requestTimeout: 30000,
  log: logLevel,
  apiVersion: '5.6',
  agent
});

function reduce(item) {
  return item._source;
}

async function query({ query, aggs, size = 20, from = 0 }) {
  const esQuery = {
    size,
    from,
    query,
    aggs
  }
  let body = await search({ client, index: searchIndex, query: esQuery });
  body.hits.hits = body.hits.hits.map(n => reduce(n));
  return {
    esBody: esQuery,
    result: _.pick(body, ['hits', 'aggregations'])
  };
}

async function byKey({ key }) {
  const query = {
    "size": 1,
    "query": {
      "bool": {
        "filter": {
          "term": {
            "id": key
          }
        }
      }
    }
  };
  let body = await search({ client, index: searchIndex, query });
  if (body.hits.total === 1) {
    return reduce(body.hits.hits[0]);
  } else if (body.hits.total > 1) {
    // TODO log that an error has happened. there should not be 2 entries for one ID
    throw new ResponseError(503, 'serverError', 'The ID is not unique, more than one entry found.');
  } else {
    throw new ResponseError(404, 'notFound', 'Not found');
  }
}

module.exports = {
  query,
  byKey
};