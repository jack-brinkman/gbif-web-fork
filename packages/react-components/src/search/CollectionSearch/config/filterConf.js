export const filters = [
  'q', 'institutionKey', 'city', 'country', 'code', 'alternativeCode'
].sort();

const highlighted = [
  'q', 'institutionKey', 'city', 'country', 'code'
];

export default { filters, included: filters, highlighted };