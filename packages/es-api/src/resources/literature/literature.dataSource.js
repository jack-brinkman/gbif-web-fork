const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { ResponseError } = require('../errorHandler');
const { search } = require('../esRequest');
const env = require('../../config');
const { reduce } = require('./reduce');
const { queryReducer } = require('../../responseAdapter');

const searchIndex = 'literature';

const agent = () => new Agent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

var client = new Client({
  nodes: env.literature.hosts,
  maxRetries: env.literature.maxRetries || 3,
  requestTimeout: env.literature.requestTimeout || 60000,
  agent
});

async function query({ query, aggs, size = 20, from = 0, req }) {
  if (parseInt(from) + parseInt(size) > env.literature.maxResultWindow) {
    throw new ResponseError(400, 'BAD_REQUEST', `'from' + 'size' must be ${env.literature.maxResultWindow} or less`);
  }
  const esQuery = {
    sort: [
      '_score',
      { created: { "order": "desc" } }
    ],
    track_total_hits: true,
    size,
    from,
    query,
    aggs,
  }
  let response = await search({ client, index: searchIndex, query: esQuery, req });
  let body = response.body;
  body.hits.hits = body.hits.hits.map(n => reduce(n));
  return {
    esBody: esQuery,
    result: queryReducer({body, size, from})
  };
}

async function byKey({ key, req }) {
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
  let response = await search({ client, index: searchIndex, query, req });
  let body = response.body;
  const total = body.hits.total.value || body.hits.total; // really just while es versions change between 5 > 7
  if (total === 1) {
    return reduce(body.hits.hits[0]);
  } else if (total > 1) {
    // TODO log that an error has happened. there should not be 2 entries for ID
    throw new ResponseError(503, 'serverError', 'The ID is not unique, more than one entry found.');
  } else {
    throw new ResponseError(404, 'notFound', 'Not found');
  }
}

module.exports = {
  query,
  byKey
};