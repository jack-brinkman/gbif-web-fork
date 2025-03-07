const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    collectionSearch(
      limit: Int, 
      offset: Int, 
      q: String,
      institution: [GUID],
      contact: ID,
      code: String,
      name: String,
      fuzzyName: String,
      city: String,
      country: Country,
      alternativeCode: String
      active: Boolean
      numberSpecimens: String
      displayOnNHCPortal: Boolean
      ): CollectionSearchResults
    collection(key: String!): Collection
  }

  type CollectionSearchResults {
    results: [Collection]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Collection {
    key: ID!
    code: String
    name: String
    description: String
    contentTypes: [CollectionContentType]
    active: Boolean
    personalCollection: Boolean
    doi: String
    email: [String]
    phone: [String]
    homepage: URL
    catalogUrl: URL
    apiUrl: URL
    preservationTypes: [PreservationType]
    accessionStatus: AccessionStatus
    institutionKey: ID
    institution: Institution
    mailingAddress: Address
    address: Address
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    deleted: DateTime
    replacedBy: ID
    replacedByCollection: Collection
    tags:[Tag]
    identifiers: [Identifier]
    """
    The contacts type is deprecated and will no longer be updated
    """
    contacts: [StaffMember]
    contactPersons: [ContactPerson]!
    indexHerbariorumRecord: Boolean
    numberSpecimens: Int
    machineTags: [MachineTag]
    taxonomicCoverage: String
    geography: String
    notes: String
    incorporatedCollections: [String]
    importantCollectors: [String]
    collectionSummary: JSON
    alternativeCodes: [AlternativeCode]
    comments: Comment

    occurrenceCount: Int
    excerpt: String
    richness: Float
  }

  type AlternativeCode {
    code: String!
    description: String
  }
`;

module.exports = typeDef;