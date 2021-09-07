const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
//my code
const langindex = require('./langindex');


//parse requested language name
app.param('LanguageName', function(req, res, next, LanguageName) {
	console.log("parsing language");
  const modified = LanguageName.toLowerCase();
	req.params.LanguageName = modified;
	if (langindex.langlist.indexOf(req.params.LanguageName) != -1){
		req.params.LangNum = langindex.langlist.indexOf(req.params.LanguageName)
  	next();
	}
	else{
		return res.send({Error: "Language not found: " + req.params.LanguageName});
	}
});

//parse requested single level
app.param('LevelNum', function (req, res, next, lnum) {
	console.log("parsing single level num");
	lnum = Math.min(lnum,langindex.langindex.Languages[req.params.LangNum].NumLevels);
	req.params.LevelNum = Math.max(lnum,0);
	req.params.LevelStartInc = req.params.LevelNum;
	req.params.LevelEndInc = req.params.LevelNum;
	next();
});
//parse requested start level
app.param('LevelStartInc', function (req, res, next, lnum) {
	console.log("parsing level start number");
	lnum = Math.max(lnum,0);
	req.params.LevelStartInc = Math.min(lnum,langindex.langindex.Languages[req.params.LangNum].NumLevels);

	next();
});
//parse requested end level
app.param('LevelEndInc', function (req, res, next, lnum) {
	console.log("parsing level end number");
	lnum = Math.min(lnum,langindex.langindex.Languages[req.params.LangNum].NumLevels);
	req.params.LevelEndInc = Math.max(lnum,0);
	if (req.params.LevelEndInc <req.params.LevelStartInc){
		var t = req.params.LevelStartInc;
		req.params.LevelStartInc = req.params.LevelEndInc;
		req.params.LevelEndInc = t;
	}
	next();
});

//set up app routes

app.get('/', function (req, res) {
    return res.send({greeting: 'Hello World!'})
});

app.get("/sample", function (req, res) {
	return res.send(JSON.parse(fs.readFileSync('ExampleReturn.json')));
});

app.get('/language/:LanguageName/level/:LevelNum', requestLevelRange);

app.get('/language/:LanguageName/levels/:LevelStartInc/:LevelEndInc', requestLevelRange);
app.get('/language/:LanguageName/:LevelStartInc/:LevelEndInc', requestLevelRange);

app.get('/language/:LanguageName/:LevelNum', requestLevelRange);

app.get('/language/:LanguageName', function (req, res) {
		req.params.LevelStartInc = 0;
		req.params.LevelEndInc = langindex.langindex.Languages[req.params.LangNum].NumLevels;
		requestLevelRange(req,res);
});




function requestLevelRange(req, res){
		var slevel = req.params.LevelStartInc;
		var elevel = req.params.LevelEndInc;
		//the good stuff will happen here
		return res.send({RequestedLanguage: req.params.LanguageName,LanguageNumber: req.params.LangNum, StartingLevel: slevel, EndingLevel: elevel});
}


app.listen(3000, function () {
  console.log('Accepting queries for the following languages:');
	console.log(langindex.langlist);
});
