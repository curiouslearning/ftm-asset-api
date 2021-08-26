const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
//my code
const langindex = require('./langindex');



app.param('LanguageName', function(req, res, next, LanguageName) {
  const modified = LanguageName.toLowerCase();
	req.params.LanguageName = modified;
  next();
});

app.get('/', function (req, res) {
    return res.send({greeting: 'Hello World!'})
});

app.get("/sample", function (req, res) {
	return res.send(JSON.parse(fs.readFileSync('ExampleReturn.json')));
});

app.get('/language/:LanguageName/levelrange/:LevelStartInc/:LevelEndInc', function (req, res) {
	var slevel = 0;
	var elevel = 0;
	if (req.params.LevelEndInc >= req.params.LevelStartInc){
		slevel = req.params.LevelStartInc;
		elevel = req.params.LevelEndInc;
	}
	else{
		slevel = req.params.LevelEndInc;
		elevel = req.params.LevelStartInc;
	}
	slevel = Math.max(0,slevel);
	return res.send({RequestedLanguage: req.params.LanguageName, StartingLevel: slevel, EndingLevel: elevel});
//  return res.send(JSON.parse(fs.readFileSync('ExampleReturn.json')));
});

app.get('/language/:LanguageName', function (req, res) {
	if (langindex.langlist.indexOf(req.params.LanguageName) != -1){
		var slevel = 0;
		var elevel = langindex.langindex.Languages[langindex.langlist.indexOf(req.params.LanguageName)].NumLevels;

			return res.send({RequestedLanguage: req.params.LanguageName, StartingLevel: slevel, EndingLevel: elevel});
	}
	else{
		return res.send({Error: "Language not found: " + req.params.LanguageName});
	}

//  return res.send(JSON.parse(fs.readFileSync('ExampleReturn.json')));
});

app.listen(3000, function () {
  console.log('Accepting queries for the following languages:');
	console.log(langindex.langlist);
});
