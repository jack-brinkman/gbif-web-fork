export const all = [
  'taxonKey',
  'country',
  'publishingCountryCode',
  'datasetKey',
  'publisherKey',
  'institutionCode',
  'catalogNumber',
  'hostingOrganizationKey',
  'year',
  'basisOfRecord',
  'typeStatus',
  'occurrenceIssue',
  'mediaTypes',
  'sampleSizeUnit',
  'license',
  'coordinateUncertainty',
  'depth',
  'organismQuantity',
  'sampleSizeValue',
  'relativeOrganismQuantity',
  'month',
  'continent',
  'protocol',
  'establishmentMeans',
  'recordedBy',
  'recordNumber',
  'collectionCode',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'locality',
  'waterBody',
  'stateProvince',
  'eventId',
  'samplingProtocol',
  'elevation',
  'occurrenceStatus',
  'gadmGid',
  'identifiedBy',
  'isInCluster',
  'institutionKey',
  'q',
  'verbatimScientificName',
  'dwcaExtension'
].sort();

const highlighted = [
  'occurrenceStatus',
  'taxonKey',
  'year',
  'country',
  'occurrenceIssue'
];

export default { filters: all, included: all, highlighted };