const _ = require("lodash");
const { gbif, ala } = require("gql-resolvers");

const resolvers = _.merge(
  gbif.graphql.scalars.resolver,
  gbif.graphql.dataset.resolver,
  gbif.graphql.organization.resolver,
  gbif.graphql.taxon.resolver,
  gbif.graphql.network.resolver,
  gbif.graphql.installation.resolver,
  gbif.graphql.node.resolver,
  gbif.graphql.participant.resolver,
  // gbif.graphql.occurrence.resolver,
  gbif.graphql.wikidata.resolver,
  gbif.graphql.collection.resolver,
  gbif.graphql.institution.resolver,
  gbif.graphql.staffMember.resolver,
  gbif.graphql.external.orcid.resolver,
  gbif.graphql.external.viaf.resolver,
  gbif.graphql.external.person.resolver,
  gbif.graphql.literature.resolver,
  gbif.graphql.download.resolver,
  ala.graphql.event.resolver
  // -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  resolvers,
};
