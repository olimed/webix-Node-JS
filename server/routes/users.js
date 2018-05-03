let db = require("../db");

module.exports = {
	getData: (req, res) => {
		db.user.findAll().then(data => res.json(data));
		
	}
};