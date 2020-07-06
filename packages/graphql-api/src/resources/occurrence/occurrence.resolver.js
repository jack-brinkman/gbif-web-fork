const { getGlobe } = require('../../util/globe');
const { getFacet, getStats } = require('./helpers/getMetrics');
const fieldsWithFacetSupport = require('./helpers/fieldsWithFacetSupport');
const fieldsWithStatsSupport = require('./helpers/fieldsWithStatsSupport');
const verbatimResolvers = require('./helpers/occurrenceTerms');
const groupResolvers = require('./helpers/occurrenceEsField');


// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName);
  return dictionary;
};
const OccurrenceFacet = fieldsWithFacetSupport.reduce(facetReducer, {});

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName);
  return dictionary;
};
const OccurrenceStats = fieldsWithStatsSupport.reduce(statsReducer, {});

const searchOccurrences = (parent, query, { dataSources }) => {
  return dataSources.occurrenceAPI.searchOccurrenceDocuments({
    query: { predicate: parent._predicate, ...query }
  });
}

const facetOccurrenceSearch = (parent) => {
  return { _predicate: parent._predicate };
};

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    occurrenceSearch: (parent, args) => {
      // dataSources.occurrenceAPI.searchOccurrences({ query: args }),
      return { _predicate: args.predicate };
    },
    occurrence: (parent, { key }, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({ key }),
    globe: (parent, { cLat, cLon, pLat, pLon, sphere, graticule, land }) => {
      const roundedLat = Math.floor(pLat / 30) * 30;
      const simpleLat = Math.min(Math.max(roundedLat, -60), 60);
      const simpleLon = Math.round(pLon / 30) * 30;
      const lat = typeof cLat === 'number' ? cLat : simpleLat;
      const lon = typeof cLon === 'number' ? cLon : simpleLon;

      const svg = getGlobe({
        center: {
          lat,
          lng: lon
        },
        point: {
          lat: pLat,
          lng: pLon
        },
        options: {
          sphere, graticule, land
        }
      });
      return {
        svg,
        lat,
        lon
      }
    }
  },
  Occurrence: {
    ...verbatimResolvers,
    primaryImage: ({ multimediaItems }) => {
      if (typeof multimediaItems === 'undefined') return null;
      // extract primary image. for now just any image
      return multimediaItems.find(x => x.type === 'StillImage');
    },
    volatile: (occurrence) => occurrence,
    groups: (occurrence) => occurrence
  },
  OccurrenceSearchResult: {
    documents: searchOccurrences,
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    stats: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.occurrenceAPI.meta({
        query: { predicate: parent._predicate }
      });
    }
  },
  OccurrenceNameUsage: {
    formattedName: ({ key }, args, { dataSources }) =>
      dataSources.taxonAPI.getParsedName({ key }),
  },
  OccurrenceStats,
  OccurrenceFacet,
  OccurrenceFacetResult_float: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_string: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_boolean: {
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_dataset: {
    dataset: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_node: {
    node: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.nodeAPI.getNodeByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_installation: {
    installation: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.installationAPI.getInstallationByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_taxon: {
    taxon: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.taxonAPI.getTaxonByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_network: {
    network: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.networkAPI.getNetworkByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  OccurrenceFacetResult_organization: {
    publisher: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    occurrences: facetOccurrenceSearch
  },
  Globe: {

  },
  VolatileOccurrenceData: {
    globe: ({ coordinates }, { sphere, graticule, land }) => {
      const roundedLat = Math.floor(coordinates.lat / 30) * 30;
      const lat = Math.min(Math.max(roundedLat, -60), 60);
      const lon = Math.round(coordinates.lon / 30) * 30;

      const svg = getGlobe({
        center: {
          lat: lat,
          lng: lon
        },
        point: {
          lat: coordinates.lat,
          lng: coordinates.lon
        },
        options: {
          sphere, graticule, land
        }
      });
      return {
        svg,
        lat,
        lon
      }
    }
  },
  TermGroups: {
    Taxon: groupResolvers.Taxon,
    Record: groupResolvers.Record,
    Location: groupResolvers.Location
  }
};

