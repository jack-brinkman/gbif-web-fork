const { getFacet, getStats } = require('./getMetrics');
const fieldsWithFacetSupport = require('./fieldsWithFacetSupport');
const fieldsWithStatsSupport = require('./fieldsWithStatsSupport');

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
    query: { predicate: parent._query, ...query }
  });
}

const facetOccurrenceSearch = (parent) => ({ _query: parent._query });
/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    occurrenceSearch: (parent, args) =>
      // dataSources.occurrenceAPI.searchOccurrences({ query: args }),
      ({ _query: args.predicate }),
    occurrence: (parent, { key }, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({ key })
  },
  Occurrence: {
    // someField: ({ fieldWithKey: key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   dataSources.someAPI.getSomethingByKey({ key })
    // },
  },
  OccurrenceSearchResult: {
    documents: searchOccurrences,
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => {
      return { _query: { ...parent._query, limit: undefined, offset: undefined } };
    },
    stats: (parent) => {
      return { _query: { ...parent._query, limit: undefined, offset: undefined } };
    },
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
};