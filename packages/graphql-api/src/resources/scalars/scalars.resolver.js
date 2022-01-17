const { URLResolver, EmailAddressResolver, JSONResolver, GUIDResolver } = require('graphql-scalars');
const DateTimeResolver = require('./dateTime');

module.exports = {
  JSON: JSONResolver, // last resort type for unstructured data
  URL: URLResolver, 
  DateTime: DateTimeResolver, 
  EmailAddress: EmailAddressResolver, 
  GUID: GUIDResolver
};