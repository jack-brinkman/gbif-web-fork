const _ = require("lodash");
const { gbif, ala } = require("gql-resolvers");

const api = _.merge(
  gbif.dataset.dataSource,
  gbif.organization.dataSource,
  gbif.taxon.dataSource,
  gbif.network.dataSource,
  gbif.installation.dataSource,
  gbif.node.dataSource,
  gbif.participant.dataSource,
  // gbif.occurrence.dataSource,
  gbif.wikidata.dataSource,
  gbif.collection.dataSource,
  gbif.institution.dataSource,
  gbif.staffMember.dataSource,
  gbif.external.orcid.dataSource,
  gbif.external.viaf.dataSource,
  gbif.external.person.dataSource,
  gbif.literature.dataSource,
  gbif.download.dataSource,
  ala.occurrence.dataSource,
  ala.images.dataSource,
  ala.event.dataSource
  // -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  api,
};
