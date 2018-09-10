const express = require('express');
const Notes = require('../models/note');
const notesRouter = express.Router();

notesRouter.get('/v1/notes', (req, res) =>{

	//Get query params
	let page = req.query.page;
	let limit = req.query.limit;
  let top = req.query.top;
  let user = req.query.user;
  let sort = null;

  if (top) {
    sort = {votes: -1}
  }


	//Get query params [PAGE]
	if (page) {
		page = parseInt(page);
	} else {
		page = 1;
	}

	//Get query params [LIMIT]
	if (limit) {
	    limit = parseInt(limit);
	} else {
		limit = 5;
	}

	//Perform search in node with pagination
	Notes.getNotes(page, limit, user, sort, (err, notes) => {
		if(err){
 			throw err;
		}
    if (notes.docs.length) {
      notes.docs = notes.docs.map((note) => {
        note.text = `${note.text.substring(0, 250)}…`
        return note
      })
    }
		return res.send(notes);
	});

});

notesRouter.get('/v1/note/:id', (req, res) => {
	Notes.getNote(req.params.id, (err, nota) => {
		if(err){
 			throw err;
		}
    if (nota) {
      return res.send(nota);
    } else {
      return res.status(404).send();
    }
	});
});

notesRouter.put('/v1/note/:id', (req, res) => {
  const noteUpdate = req.body;
  Notes.getNote(req.params.id, (err, note) => {
    if(err){
      throw err;
    }
    if (note) {
      note.set(noteUpdate);
      note.save((err, noteUpdated) => {
        if (err) {
          throw err;
        }
        return res.send(noteUpdated);
      })
    } else {
      return res.status(404).send();
    }
  });
})

notesRouter.post('/v1/notes', (req, res) => {
	const note = req.body;
	if (note.title && note.author) {
		Notes.addNote(note, (err, nota) => {
			if(err){
				console.error(err.stack);
				return res.status(500).send('something went wrong!!!')
			}
			return res.status(201).send(nota);
		});
	} else {
		return res.status(400).send({error: 'title and author are required'});
	}
});

notesRouter.post('/v1/note/vote/:id', (req, res) => {
  const newVote = req.body;
  Notes.getNote(req.params.id, (err, note) => {
    if (err) {
      throw err;
    }
    if (note) {
      const index = note.votedBy.findIndex((v) => v.user === newVote.user)
      if (index > -1) {
        const vote = note.votedBy[index];
        if (vote.vote !== newVote.vote) {
          const newVotes = note.votedBy.concat([])
          newVotes[index] = newVote;
          const voteScore = note.votes + (newVote.vote * 2);
          note.set({votedBy: newVotes, votes: voteScore});
          note.save((err, noteUpdated) => {
            if (err) {
              throw err;
            }
            return res.status(201).send({votes: noteUpdated.votes, votedBy: noteUpdated.votedBy});
          })
        } else {
          return res.status(401).send();
        }
      } else {
        const newVotes = note.votedBy.concat([newVote])
        const voteScore = note.votes + newVote.vote;
        note.set({votedBy: newVotes, votes: voteScore});
        note.save((err, noteUpdated) => {
          if (err) {
            throw err;
          }
          return res.status(201).send({votes: noteUpdated.votes, votedBy: noteUpdated.votedBy});
        })
      }
    } else {
      return res.status(404).send();
    }
  })
})

notesRouter.delete('/v1/note/:id', (req, res, next) => {
  Notes.getNote(req.params.id, (err, note) => {
    if (err) {
      throw err;
    }
    if (note) {
      note.set({deleted: true});
      note.save((err, noteUpdated) => {
        if (err) {
          throw err;
        }
        return res.status(204).send();
      })
    } else {
      return res.status(404).send();
    }
  })
});


module.exports = notesRouter;
