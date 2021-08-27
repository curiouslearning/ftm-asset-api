const fs = require('fs');

//hold an index of the languages we can serve
var langindex = JSON.parse(fs.readFileSync('src/LanguageIndex.json'));
var langlist = [];
langlist = langindex.Languages.map(function(lang) {
       return(lang.LanguageName.toLowerCase());
   });

exports.langlist = langlist;
exports.langindex = langindex;
