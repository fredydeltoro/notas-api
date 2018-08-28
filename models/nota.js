const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const notaSchema = mongoose.Schema({
	title:{
		type: String,
		required: true,
		default:null
	},
	text:{
		type: String,
		required: false,
		default:null
	}
});

notaSchema.plugin(mongoosePaginate);

var Nota = module.exports = mongoose.model('notas', notaSchema);

//get notas
module.exports.getNotas = (page, max, callback, limit) => {
	Nota.paginate({}, { page: page, limit: max }, function(err, result) {
		callback(err,result)
	});
}



//get a nota by id
module.exports.getNotaById = (notaId, callback) => {
	Nota.findById(notaId, callback);
}

//add new nota
module.exports.addNota = (nota, callback) => {
	Nota.create(nota, callback);
}

