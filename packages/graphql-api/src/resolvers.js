const { merge } = require("lodash");
const { gbif, ala } = require("gql-resolvers");

const resolvers = merge(
  gbif.scalars.resolver,
  gbif.dataset.resolver,
  gbif.organization.resolver,
  gbif.taxon.resolver,
  gbif.network.resolver,
  gbif.installation.resolver,
  gbif.node.resolver,
  gbif.participant.resolver,
  // gbif.occurrence.resolver,
  gbif.wikidata.resolver,
  gbif.collection.resolver,
  gbif.institution.resolver,
  gbif.staffMember.resolver,
  gbif.external.orcid.resolver,
  gbif.external.viaf.resolver,
  gbif.external.person.resolver,
  gbif.literature.resolver,
  gbif.download.resolver,
  ala.occurrence.resolver,
  ala.images.resolver,
  ala.event.resolver
  // -- Add imports above this line (required by plopfile.js) --
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
module.exports = {
  resolvers,
};
