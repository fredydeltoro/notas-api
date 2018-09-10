const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const notesRouter = require('./routes/notes-router');

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('/', notesRouter)



mongoose.connect('mongodb://localhost/notes');
const db = mongoose.connection;



app.listen(4001, () => {
	console.log('Corriendo app');
});
