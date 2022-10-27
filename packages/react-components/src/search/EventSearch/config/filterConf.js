export const filters = [
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventStateProvince',
  'eventID',
  'eventTaxonKey',
  'eventType',
  'locationId',
].sort();

const highlighted = [
  'eventTaxonKey',
  'eventType',
  'eventDatasetKey',
  'month',
  'year',
  'locationId',
  'eventStateProvince',
  'measurementOrFactTypes',
];

export default { filters, included: filters, highlighted };
