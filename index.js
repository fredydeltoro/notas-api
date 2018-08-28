const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());

Notas = require('./models/nota');

mongoose.connect('mongodb://localhost/notas');
var db = mongoose.connection;

app.get('/v1/notas', (req, res) =>{
	
	//Get query params
	var page = req.query.page;
	var limit = req.query.limit;

	//Get query params [PAGE]
	if (typeof page !== 'undefined') {
		page = parseInt(page);
	}else{
		page = 1;
	}

	//Get query params [LIMIT]
	if (typeof limit !== 'undefined') {
	    limit = parseInt(limit);
	}else{
		limit = 5;
	}
	
	//Perform search in node with pagination
	Notas.getNotas(page, limit, (err, notas) => {
		if(err){
 			throw err;
		}
		res.json(notas);
	});

});

app.get('/v1/nota/:notaId', (req, res) => {
	Notas.getNotaById(req.params.notaId, (err, nota) => {
		if(err){
 			throw err;
		}
		res.json(nota);
	});
});

app.post('/v1/notas', (req, res) => {
	var nota = req.body;
	Notas.addNota(nota, (err, nota) => {
		if(err){
			throw err;
		}
		res.json(nota);
	});
});


app.listen(8080);






