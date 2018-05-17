const db = require("../models/db");
const express = require("express");
const router = express.Router();

router.get("/books", function(req, res){
	db.books.findAll().then( (data, err) => {
		if (err) {
			console.log("ERROR!");
		} else {
			res.json(data);
		}
	});	
});

router.put("/books/:id", (req, res) => {
	db.books.findById( req.body.id).then((book) => {
		book.update({
			title: req.body.title,
			author: req.body.author,
			status: req.body.status,
			size: req.body.size
		}).then( (err) => {
			if (err) {
				console.log("ERROR!");
			} else {
				res.json({});
			}
		});
	});
});

router.post("/books", (req, res) => {
	db.books.create({
		title: req.body.name,
		author: "",
		size: req.body.size,
		status: "open",
		userId: req.body.userId
	}
	).then( (err) => {
		if (err) {
			console.log("ERROR!");
		} else {
			res.json({ id: obj.id }));
		}
	});
		
});

router.delete("/books/:id", (req, res) => {
	db.books.findById(req.body.id).then((book) =>
		book.destroy()
	).then((err) => {
		if (err) {
			console.log("ERROR!");
		} else {
			res.json({});
		}
	});
});

router.get("/dynamicbooks", (req, res) => {

	let limit  = ( req.query.count || 10 ) * 1;
	let offset = ( req.query.start || 0 ) * 1;

	let where = req.query.filter ? { 
		title:  getObjLike(req.query.filter.title),
		author: getObjLike(req.query.filter.author), 
		size:   getObjLike(req.query.filter.size), 
		status: getObjLike(req.query.filter.status) 
	} : {};
	
	let order = [];
	for ( let key in req.query.sort)
		order = [[ key, req.query.sort[key]]];

	let count = db.books.findAndCountAll({ where });
	let page = db.books.findAll({
		where, limit, offset, order
	});

	Promise.all([count, page]).then(data => res.json({
		pos: offset, total_count: data[0].count, data: data[1] 
	}));
});

module.exports = router;

function getObjLike( req){
	return { $like: `%${req}%` };
}