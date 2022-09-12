export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'eventID',
  'eventTaxonKey',
  'eventType',
  'locationId',
].sort();

const highlighted = [
  'eventTaxonKey',
  'eventDatasetKey',
  'eventType',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'locationId',
];

export default { filters, included: filters, highlighted };