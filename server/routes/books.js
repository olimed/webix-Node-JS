let db = require("../db");

module.exports = {
	getData: (req, res) => {

		let limit = (req.query.count || 10)*1;
		let offset = (req.query.start || 0)*1;

		let where = req.query.filter ? { 
			title: { $like: `%${req.query.filter.title}%` }, 
			author:{ $like: `%${req.query.filter.author}%` }, 
			size:{ $like: `%${req.query.filter.size}%` }, 
			status:{ $like: `%${req.query.filter.status}%` } 
		}: {};
		let order = [];
		for(let key in req.query.sort)
			order = [[key, req.query.sort[key]]];

		let count = db.book.findAndCountAll({ where });
		let page = db.book.findAll({
			where, limit, offset, order
		});

		Promise.all([count, page]).then(data => res.json({
			pos:offset, total_count:data[0].count, data:data[1] 
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
