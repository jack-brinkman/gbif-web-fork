const { gql } = require("apollo-server");
const _ = require("lodash");
const { getEnumTypeDefs } = require("./enums");
const { gbif, ala } = require("gql-resolvers");

async function getSchema() {
  // create a string with all the enum options (loaded from the API)
  const enumsSchema = await getEnumTypeDefs();

  const rootQuery = gql`
    ${enumsSchema}

    type Query {
      """
      _empty is nonsense, and only here as we are not allowed to extend an empty type.
      """
      _empty: String
    }
  `;

  const typeDefs = _.flatten([
    rootQuery,
    require("./input"),
    gbif.graphql.misc.comment,
    gbif.graphql.misc.contact,
    gbif.graphql.misc.endpoint,
    gbif.graphql.misc.identifier,
    gbif.graphql.misc.machineTag,
    gbif.graphql.misc.tag,
    gbif.graphql.misc.address,
    gbif.graphql.dataset.typeDef,
    gbif.graphql.organization.typeDef,
    gbif.graphql.scalars.typeDef,
    gbif.graphql.taxon.typeDef,
    gbif.graphql.network.typeDef,
    gbif.graphql.installation.typeDef,
    gbif.graphql.node.typeDef,
    gbif.graphql.participant.typeDef,
    // gbif.graphql.occurrence.typeDef,
    ala.graphql.occurrence.typeDef,
    gbif.graphql.wikidata.typeDef,
    gbif.graphql.collection.typeDef,
    gbif.graphql.institution.typeDef,
    gbif.graphql.staffMember.typeDef,
    gbif.graphql.external.orcid.typeDef,
    gbif.graphql.external.viaf.typeDef,
    gbif.graphql.external.person.typeDef,
    gbif.graphql.literature.typeDef,
    gbif.graphql.download.typeDef,
    ala.graphql.event.typeDef,
    // -- Add imports above this line (required by plopfile.js) --
  ]);

  return typeDefs;
}

module.exports = {
  getSchema,
};
