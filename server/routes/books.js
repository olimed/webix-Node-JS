let db = require("../db");

module.exports = {
	getData: (req, res) => {
		db.book.findAll().then(data => res.json(data));
		
	}
};