//via https://github.com/chadlieberman/graphql-type-long/blob/master/lib/index.js
const { Kind, GraphQLScalarType } = require('graphql');

var GraphQLLong, MAX_LONG, MIN_LONG, coerceLong, parseLiteral;

MAX_LONG = Number.MAX_SAFE_INTEGER;

MIN_LONG = Number.MIN_SAFE_INTEGER;

coerceLong = function(value) {
  var num;
  if (value === '') {
    throw new TypeError('Long cannot represent non 52-bit signed integer value: (empty string)');
  }
  num = Number(value);
  if (num === num && num <= MAX_LONG && num >= MIN_LONG) {
    if (num < 0) {
      return Math.ceil(num);
    } else {
      return Math.floor(num);
    }
  }
  throw new TypeError('Long cannot represent non 52-bit signed integer value: ' + String(value));
};

parseLiteral = function(ast) {
  var num;
  if (ast.kind === Kind.INT) {
    num = parseInt(ast.value, 10);
    if (num <= MAX_LONG && num >= MIN_LONG) {
      return num;
    }
    return null;
  }
};

GraphQLLong = new GraphQLScalarType({
  name: 'Long',
  description: 'The `Long` scalar type represents 52-bit integers',
  serialize: coerceLong,
  parseValue: coerceLong,
  parseLiteral: parseLiteral
});

module.exports = GraphQLLong;