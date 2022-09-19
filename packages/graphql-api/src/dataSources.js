const _ = require("lodash");
const { gbif, ala } = require("gql-resolvers");

const api = _.merge(
  gbif.graphql.dataset.dataSource,
  gbif.graphql.organization.dataSource,
  gbif.graphql.taxon.dataSource,
  gbif.graphql.network.dataSource,
  gbif.graphql.installation.dataSource,
  gbif.graphql.node.dataSource,
  gbif.graphql.participant.dataSource,
  // gbif.graphql.occurrence.dataSource,
  gbif.graphql.wikidata.dataSource,
  gbif.graphql.collection.dataSource,
  gbif.graphql.institution.dataSource,
  gbif.graphql.staffMember.dataSource,
  gbif.graphql.external.orcid.dataSource,
  gbif.graphql.external.viaf.dataSource,
  gbif.graphql.external.person.dataSource,
  gbif.graphql.literature.dataSource,
  gbif.graphql.download.dataSource,
  ala.graphql.event.dataSource
  // -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  api,
};
