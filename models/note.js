const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const noteSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		default: null
	},
	text: {
		type: String,
		required: false,
		default: null
	},
	author: {
		type: String,
		required: true,
		default: null
	},
	votes: {
		type: Number,
		required: false,
		default: 0
	},
	votedBy: {
		type: Array,
		required: false,
		default: []
	},
	deleted: {
		type: Boolean,
		required: true,
		default: false
	}
});

noteSchema.plugin(mongoosePaginate);

const Note = mongoose.model('notes', noteSchema);

//get notas
const getNotes = (page, max, user, sort, callback) => {
	let options = { page: page, limit: max }
	let params = {deleted: false}
	if (sort) {
		options['sort'] = sort
	}
	if (user) {
		params['author'] = user;
	}
	Note.paginate(params, options, function(err, result) {
		callback(err,result)
	});
}


//get a nota by id
const getNote = (id, callback) => {
	Note.findOne({_id: id, deleted:false}, callback);
}

//add new nota
const addNote = (nota, callback) => {
	Note.create(nota, callback);
}

module.exports = {
	Note,
	getNotes,
	getNote,
	addNote
}
