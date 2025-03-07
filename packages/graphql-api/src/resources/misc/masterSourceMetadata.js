

const { gql } = require('apollo-server');

const typeDef = gql`
type MasterSourceMetadata {
  key: ID!
  source: String!
  sourceId: String!
  createdBy: String!
  created: String!
}
`;

module.exports = typeDef;
