/**
 * Create a nonsense translation that is still readable. 
 * This can make it easier to test that everything is in the translation file.
 * E.g. `Dataset search` is transformed into `[!!Đàťȁŝĕŧ şȅăŕćĥ!!]`. 
 * So if plain english text appears anywhere, then that value hasn't been added to the translation file.
 */
let pseudoloc = require('pseudoloc');
let _ = require('lodash');

function createPseudo(object, path) {
  const newObject = _.clone(object);

  _.each(object, (val, key) => {
    if (typeof val === 'string') {
      newObject[key] = getMockText(val);
    } else if (typeof (val) === 'object') {
      let nestedPath = path ? path + key + '.' : key + '.';
      newObject[key] = createPseudo(val, nestedPath);
    }
  });
  return newObject;
}

function getMockText(str) {
  // do not use mock texts for translations with variables as the vairiables then won't work, instead we will just wrap those in brackets: [[[! plain text !]]]
  if ((str.indexOf('{') !== -1) || (str.indexOf('%s') !== -1)) {
    return '[[[!' + str + '!]]]';
  }
  return pseudoloc.str(str);
}

module.exports = createPseudo;