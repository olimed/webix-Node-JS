let db = require("../db");

module.exports = {
	getData: (req, res) => {

		var limit = (req.query.count || 20)*1;
		var offset = (req.query.start || 0)*1;

		var where = req.query.filter ? { 
			title: { $like:"%"+req.query.filter.title+"%" }, 
			author:{ $like:"%"+req.query.filter.author+"%" }, 
			size:{ $like:"%"+req.query.filter.size+"%" }, 
			status:{ $like:"%"+req.query.filter.status+"%" } 
		}: {};
		let order = [];
		for(let key in req.query.sort)
			order = [[key, req.query.sort[key]]];

		var count = db.book.findAndCountAll({ where });
		var page = db.book.findAll({
			where, limit, offset, order
		});

		Promise.all([count, page]).then(data => res.json({
			pos:offset, total_count:data[0], data:data[1] 
		}));
	},
	updateItem: (req, res) => {
		db.book.findById(req.body.id).then((book) => {
			book.update({
				title: req.body.title,
				author: req.body.author,
				status: req.body.status,
				size: req.body.size
			}).then(() => res.json({}));
		});
	},
	upload: (req, res) => {
		db.book.create({
			title: req.body.name,
			author: "",
			size: req.body.size,
			status: "open",
			userId: req.body.userId
		}
		).then((obj) => 
			res.json({ id: obj.id }));
	},
	delete: (req, res) => {
		db.book.findById(req.body.id).then((book) =>
			book.destroy()
		).then(() => res.json({}));
	}

};
