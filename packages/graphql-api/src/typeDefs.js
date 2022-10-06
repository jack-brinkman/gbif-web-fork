const { gql } = require("apollo-server");
const { flatten } = require("lodash");
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

  const typeDefs = flatten([
    rootQuery,
    require("./input"),
    gbif.misc.comment,
    gbif.misc.contact,
    gbif.misc.endpoint,
    gbif.misc.identifier,
    gbif.misc.machineTag,
    gbif.misc.tag,
    gbif.misc.address,
    gbif.dataset.typeDef,
    gbif.organization.typeDef,
    gbif.scalars.typeDef,
    gbif.taxon.typeDef,
    gbif.network.typeDef,
    gbif.installation.typeDef,
    gbif.node.typeDef,
    gbif.participant.typeDef,
    // gbif.occurrence.typeDef,
    gbif.wikidata.typeDef,
    gbif.collection.typeDef,
    gbif.institution.typeDef,
    gbif.staffMember.typeDef,
    gbif.external.orcid.typeDef,
    gbif.external.viaf.typeDef,
    gbif.external.person.typeDef,
    gbif.literature.typeDef,
    gbif.download.typeDef,
    ala.occurrence.typeDef,
    ala.images.typeDef,
    ala.event.typeDef,
    // -- Add imports above this line (required by plopfile.js) --
  ]);

  return typeDefs;
}

module.exports = {
  getSchema,
};
