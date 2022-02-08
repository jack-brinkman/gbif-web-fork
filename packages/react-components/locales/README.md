# Translation

We use [Crowdin](https://crowdin.com/project/gbif-portal) for translations.

The source for the translations is what is called `en-developer`. This is translated into proper english in https://crowdin.com/project/gbif-portal-en. This is done by the secretariat.
The proper english version is then used as the foundation for translation into other languages. This is done in https://crowdin.com/project/gbif-portal.

The translations from Crowdin will appear as pull requests and go into the `translations` folder.

The translation files are split into [multiple json files](./source/en-developer) to have a better overview. But the files are merged into one big json file for the final translation file. This is done by `build.js` which defined which files to include and how to name them.

The file [localeMaps.json](./scripts/localeMaps.json) defined how the various translations map to other projects. E.g. what is the name of the locale on GBIF.org. Or what is that locale called in the vocabulary server. This is required naming vary across projects. E.g. the voacabulary uses `es-ES` but gbif.org simply use `es`.

The file [createPseudo.json](./scripts/createPseudo.js) is a convinence script that generates an english looking translation for anything in the translation file. This can be useful to check that the UI is translatable, even if it hasn't been translated yet. E.g. `Dataset search` is transformed into `[!!Đàťȁŝĕŧ şȅăŕćĥ!!]`. If a developer has left behind hardcoded text or the text hasn't been added to the translation file, then it will show clearly when the pseudo language is selected.