const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    person(type: String, value: String, expand: Boolean): Person
  }

  type Person {
    name: JSON
    birthDate: JSON
    deathDate: JSON
    image: JSON
  }
`;

module.exports = typeDef;