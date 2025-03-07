'use strict';
const _ = require('lodash');
const { ResponseError } = require('../../resources/errorHandler');

function metric2aggs(metrics = {}, config) {
  let aggs = {};
  for (let [name, metric] of Object.entries(metrics)) {
    const conf = _.get(config, `options[${metric.key}]`);
    if (!conf) continue;
    else {
      let from = parseInt(metric.from || 0);
      let size = parseInt(metric.size || 10) || 10;
      switch (metric.type) {
        case 'facet': {
          if (!['keyword', 'numeric', 'boolean'].includes(conf.type)) {
            throw new ResponseError(400, 'badRequest', 'Facets are only supported on keywords, boolean and numeric fields');
          }

          let order;
          if (metric.order) {
            if (metric.order === 'TERM_ASC') {
              order = { "_term": "asc" };
            }
          }
          let aggName = {
            terms: {
              field: conf.field,
              size: size + from,
              include: metric.include
            }
          };
          if (order) {
            aggName.terms.order = order;
          }
          aggs[name] = aggName;

          break;
        }
        case 'stats': {
          if (conf.type !== 'numeric') throw new ResponseError(400, 'badRequest', 'Only numeric fields support this aggregation');
          aggs[name] = {
            stats: {
              field: conf.field
            }
          };
          break;
        }
        case 'histogram': {
          if (conf.type !== 'numeric') throw new ResponseError(400, 'badRequest', 'Only numeric fields support this aggregation');
          aggs[name] = {
            histogram: {
              field: conf.field,
              interval: metric.interval || 45
            }
          };
          break;
        }
        case 'auto_date_histogram': {
          if (conf.type !== 'date') throw new ResponseError(400, 'badRequest', 'Only date fields support this aggregation');
          aggs[name] = {
            auto_date_histogram: {
              field: conf.field,
              buckets: metric.buckets || 10
            }
          };
          break;
        }
        case 'date_histogram': {
          if (conf.type !== 'date') throw new ResponseError(400, 'badRequest', 'Only date fields support this aggregation');
          aggs[name] = {
            date_histogram: {
              field: conf.field,
              calendar_interval: metric.calendarInterval || '1M'
            }
          };
          break;
        }
        case 'cardinality': {
          if (!['keyword', 'numeric', 'boolean'].includes(conf.type)) throw new ResponseError(400, 'badRequest', 'Facets are only supported on keywords, boolean and numeric fields');
          aggs[name] = {
            cardinality: {
              field: conf.field,
              precision_threshold: metric.precision_threshold || 10000
            }
          };
          break;
        }
        default: {
          // ignore unknown types
          break;
        }
      }
      if (aggs[name] && metric.metrics) {
        const subAggregations = metric2aggs(metric.metrics, config);
        aggs[name].aggs = subAggregations;
      }
    }
  }
  return aggs;
}

module.exports = {
  metric2aggs
}
